// src/hooks/useMembersAPI.js
import { useState, useCallback } from 'react'
import apiClient from '../lib/apiClient'
import toast from 'react-hot-toast'

export function useMembersAPI() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/api/members')
      setMembers(res.data.data)
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to fetch members.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const createMember = useCallback(async (memberData) => {
    try {
      const res = await apiClient.post('/api/members', memberData)
      setMembers(prev => [res.data.data, ...prev])
      toast.success('Member created successfully.')
      return { success: true, data: res.data.data }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create member.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  const updateMember = useCallback(async (id, updates) => {
    try {
      const res = await apiClient.put(`/api/members/${id}`, updates)
      setMembers(prev => prev.map(m => m.id === id ? res.data.data : m))
      toast.success('Member updated.')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update member.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  const updateStatus = useCallback(async (id, status) => {
    try {
      const res = await apiClient.patch(`/api/members/${id}/status`, { status })
      setMembers(prev => prev.map(m => m.id === id ? res.data.data : m))
      toast.success(status === 'blocked' ? 'Member blocked.' : 'Member unblocked.')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update status.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  const resetPassword = useCallback(async (id) => {
    try {
      const res = await apiClient.patch(`/api/members/${id}/reset-password`)
      toast.success('Password reset successfully.')
      return { success: true, temp_password: res.data.data.temp_password }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to reset password.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  const deleteMember = useCallback(async (id) => {
    try {
      await apiClient.delete(`/api/members/${id}`)
      setMembers(prev => prev.filter(m => m.id !== id))
      toast.success('Member deleted.')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to delete member.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  return {
    members,
    loading,
    error,
    fetchMembers,
    createMember,
    updateMember,
    updateStatus,
    resetPassword,
    deleteMember
  }
}
