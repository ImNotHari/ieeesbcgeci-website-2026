// backend/controllers/memberController.js
const supabase = require('../db/supabaseClient')

const getAllMembers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, ieee_number, semester, role, status, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    return res.status(200).json({ success: true, data, message: 'Members fetched.' })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, code: 500 })
  }
}

const getMemberById = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, ieee_number, semester, role, status, created_at')
      .eq('id', id)
      .single()

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Member not found.', code: 404 })
    }

    return res.status(200).json({ success: true, data, message: 'Member fetched.' })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, code: 500 })
  }
}

const createMember = async (req, res) => {
  try {
    const { full_name, email, ieee_number, semester } = req.body

    if (!full_name || !email || !ieee_number || !semester) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required: full_name, email, ieee_number, semester.',
        code: 400
      })
    }

    const tempPassword = `GECI_${Math.random().toString(36).slice(-8).toUpperCase()}`

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return res.status(409).json({
          success: false,
          error: 'A user with this email already exists.',
          code: 409
        })
      }
      throw authError
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        ieee_number,
        semester,
        role: 'member',
        status: 'active'
      })
      .select()
      .single()

    if (profileError) {
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw profileError
    }

    return res.status(201).json({
      success: true,
      data: { ...profile, temp_password: tempPassword },
      message: 'Member created. Share the temporary password with them securely.'
    })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, code: 500 })
  }
}

const updateMember = async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, email, ieee_number, semester } = req.body

    const updates = {}
    if (full_name) updates.full_name = full_name
    if (email) updates.email = email
    if (ieee_number) updates.ieee_number = ieee_number
    if (semester) updates.semester = semester
    updates.updated_at = new Date().toISOString()

    if (email) {
      const { error: authEmailError } = await supabase.auth.admin.updateUserById(id, { email })
      if (authEmailError) throw authEmailError
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return res.status(200).json({ success: true, data, message: 'Member updated.' })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, code: 500 })
  }
}

const updateMemberStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be either "active" or "blocked".',
        code: 400
      })
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return res.status(200).json({
      success: true,
      data,
      message: `Member ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully.`
    })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, code: 500 })
  }
}

const resetMemberPassword = async (req, res) => {
  try {
    const { id } = req.params

    const newTempPassword = `GECI_${Math.random().toString(36).slice(-8).toUpperCase()}`

    const { error } = await supabase.auth.admin.updateUserById(id, {
      password: newTempPassword
    })

    if (error) throw error

    return res.status(200).json({
      success: true,
      data: { temp_password: newTempPassword },
      message: 'Password reset. Share the new temporary password with the member.'
    })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, code: 500 })
  }
}

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase.auth.admin.deleteUser(id)
    if (error) throw error

    return res.status(200).json({ success: true, data: null, message: 'Member deleted.' })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, code: 500 })
  }
}

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  updateMemberStatus,
  resetMemberPassword,
  deleteMember
}
