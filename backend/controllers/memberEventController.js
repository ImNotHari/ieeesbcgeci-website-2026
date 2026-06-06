// backend/controllers/memberEventController.js
const supabase = require('../db/supabaseClient')

const getMyEvents = async (req, res, next) => {
  try {
    const userId = req.user.id

    const { data, error } = await supabase
      .from('events')
      .select(`
        id, name, description, date_start, date_end,
        venue, mode, poster_url, is_locked, is_published,
        created_at, updated_at,
        profiles!events_created_by_fkey (full_name, email),
        event_collaborators (id, member_id)
      `)
      .or(`created_by.eq.${userId},event_collaborators.member_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) throw error

    return res.status(200).json({ success: true, data, message: 'Your events fetched.' })
  } catch (err) {
    next(err)
  }
}

const getMyEvent = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        profiles!events_created_by_fkey (id, full_name, email, ieee_number),
        event_collaborators (id, member_id, ou_name, ou_code, remarks),
        event_budget (id, expenditure_head, proposed_amount, actual_amount, sort_order),
        event_income (id, head, amount, sort_order),
        event_files (id, file_type, file_url, file_name, uploaded_at)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) {
      const e = new Error('Event not found.'); e.statusCode = 404; throw e;
    }

    const isCreator      = data.created_by === userId
    const isCollaborator = data.event_collaborators?.some(c => c.member_id === userId)

    if (!isCreator && !isCollaborator) {
      const e = new Error('You do not have permission to view this event.'); e.statusCode = 403; throw e;
    }

    const canEdit = isCreator && !data.is_locked

    return res.status(200).json({
      success: true,
      data:    { ...data, can_edit: canEdit },
      message: 'Event fetched.'
    })
  } catch (err) {
    next(err)
  }
}

const createMyEvent = async (req, res, next) => {
  try {
    const userId = req.user.id
    const {
      name, description, date_start, date_end, venue, mode, poster_url,
      collaborators, budget_rows, income_rows
    } = req.body

    if (!name || !venue || !mode) {
      const e = new Error('Required fields: name, venue, mode.'); e.statusCode = 400; throw e;
    }

    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        name, description, date_start, date_end, venue, mode, poster_url,
        created_by: userId,
        is_locked:  false,
        is_published: false
      })
      .select()
      .single()

    if (eventError) throw eventError

    if (collaborators && collaborators.length > 0) {
      const collaboratorData = collaborators.map(c => ({
        event_id:  event.id,
        member_id: c.member_id,
        ou_name:   c.ou_name,
        ou_code:   c.ou_code,
        remarks:   c.remarks
      }))

      const { error: collabError } = await supabase
        .from('event_collaborators')
        .insert(collaboratorData)

      if (collabError) {
        await supabase.from('events').delete().eq('id', event.id)
        throw collabError
      }
    }

    if (budget_rows && budget_rows.length > 0) {
      const budgetData = budget_rows.map((row, idx) => ({
        event_id: event.id,
        expenditure_head: row.expenditure_head,
        proposed_amount:  row.proposed_amount || 0,
        actual_amount:    row.actual_amount || 0,
        sort_order: idx
      }))

      const { error: budgetError } = await supabase
        .from('event_budget')
        .insert(budgetData)

      if (budgetError) {
        await supabase.from('events').delete().eq('id', event.id)
        throw budgetError
      }
    }

    if (income_rows && income_rows.length > 0) {
      const incomeData = income_rows.map((row, idx) => ({
        event_id: event.id,
        head:     row.head,
        amount:   row.amount || 0,
        sort_order: idx
      }))

      const { error: incomeError } = await supabase
        .from('event_income')
        .insert(incomeData)

      if (incomeError) {
        await supabase.from('events').delete().eq('id', event.id)
        throw incomeError
      }
    }

    return res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully.'
    })
  } catch (err) {
    next(err)
  }
}

const updateMyEvent = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const {
      name, description, date_start, date_end, venue, mode, poster_url,
      collaborators, budget_rows, income_rows
    } = req.body

    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('created_by, is_locked')
      .eq('id', id)
      .single()

    if (fetchError || !event) {
      const e = new Error('Event not found.'); e.statusCode = 404; throw e;
    }

    if (event.created_by !== userId) {
      const e = new Error('You can only edit events you created.'); e.statusCode = 403; throw e;
    }

    if (event.is_locked) {
      const e = new Error('This event is locked by the administrator. No edits allowed.'); e.statusCode = 403; throw e;
    }

    const updates = {}
    if (name         !== undefined) updates.name         = name
    if (description  !== undefined) updates.description  = description
    if (date_start   !== undefined) updates.date_start   = date_start
    if (date_end     !== undefined) updates.date_end     = date_end
    if (venue        !== undefined) updates.venue        = venue
    if (mode         !== undefined) updates.mode         = mode
    if (poster_url   !== undefined) updates.poster_url   = poster_url
    updates.updated_at = new Date().toISOString()

    const { error: updateError } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)

    if (updateError) throw updateError

    await supabase.from('event_collaborators').delete().eq('event_id', id)

    if (collaborators && collaborators.length > 0) {
      const collaboratorData = collaborators.map(c => ({
        event_id:  id,
        member_id: c.member_id,
        ou_name:   c.ou_name,
        ou_code:   c.ou_code,
        remarks:   c.remarks
      }))

      const { error: collabError } = await supabase
        .from('event_collaborators')
        .insert(collaboratorData)

      if (collabError) throw collabError
    }

    await supabase.from('event_budget').delete().eq('event_id', id)

    if (budget_rows && budget_rows.length > 0) {
      const budgetData = budget_rows.map((row, idx) => ({
        event_id: id,
        expenditure_head: row.expenditure_head,
        proposed_amount:  row.proposed_amount || 0,
        actual_amount:    row.actual_amount || 0,
        sort_order: idx
      }))

      const { error: budgetError } = await supabase
        .from('event_budget')
        .insert(budgetData)

      if (budgetError) throw budgetError
    }

    await supabase.from('event_income').delete().eq('event_id', id)

    if (income_rows && income_rows.length > 0) {
      const incomeData = income_rows.map((row, idx) => ({
        event_id: id,
        head:     row.head,
        amount:   row.amount || 0,
        sort_order: idx
      }))

      const { error: incomeError } = await supabase
        .from('event_income')
        .insert(incomeData)

      if (incomeError) throw incomeError
    }

    return res.status(200).json({
      success: true,
      data:    { id },
      message: 'Event updated successfully.'
    })
  } catch (err) {
    next(err)
  }
}

const deleteMyEvent = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('created_by')
      .eq('id', id)
      .single()

    if (fetchError || !event) {
      const e = new Error('Event not found.'); e.statusCode = 404; throw e;
    }

    if (event.created_by !== userId) {
      const e = new Error('You can only delete events you created.'); e.statusCode = 403; throw e;
    }

    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return res.status(200).json({ success: true, data: null, message: 'Event deleted.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getMyEvents, getMyEvent, createMyEvent, updateMyEvent, deleteMyEvent }
