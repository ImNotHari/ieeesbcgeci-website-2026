// backend/controllers/eventController.js
const supabase = require('../db/supabaseClient')

const getAllEvents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        id, title, description, is_locked, is_published, created_at, updated_at,
        profiles!events_owner_id_fkey (full_name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return res.status(200).json({ success: true, data, message: 'Events fetched.' })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, code: 500 })
  }
}

const getEventById = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        profiles!events_owner_id_fkey (full_name, email, ieee_number)
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Event not found.', code: 404 })
    }

    return res.status(200).json({ success: true, data, message: 'Event fetched.' })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, code: 500 })
  }
}

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params
    const {
      title, description, is_published
    } = req.body

    const updates = {}
    if (title !== undefined) updates.title = title
    if (description !== undefined) updates.description = description
    if (is_published !== undefined) updates.is_published = is_published
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return res.status(200).json({ success: true, data, message: 'Event updated.' })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, code: 500 })
  }
}

const toggleEventLock = async (req, res) => {
  try {
    const { id } = req.params
    const { is_locked } = req.body

    if (typeof is_locked !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'is_locked must be a boolean (true or false).',
        code: 400
      })
    }

    const { data, error } = await supabase
      .from('events')
      .update({ is_locked, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return res.status(200).json({
      success: true,
      data,
      message: `Event ${is_locked ? 'locked' : 'unlocked'} successfully.`
    })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, code: 500 })
  }
}

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) throw error

    return res.status(200).json({ success: true, data: null, message: 'Event deleted.' })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, code: 500 })
  }
}

module.exports = {
  getAllEvents,
  getEventById,
  updateEvent,
  toggleEventLock,
  deleteEvent
}
