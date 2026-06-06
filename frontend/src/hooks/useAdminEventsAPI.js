// src/hooks/useAdminEventsAPI.js
import { useState, useCallback } from 'react'
import apiClient from '../lib/apiClient'
import toast from 'react-hot-toast'

export function useAdminEventsAPI() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/api/events')
      setEvents(res.data.data)
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to fetch events.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateEvent = useCallback(async (id, updates) => {
    try {
      const res = await apiClient.put(`/api/events/${id}`, updates)
      setEvents(prev => prev.map(e => e.id === id ? res.data.data : e))
      toast.success('Event updated.')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update event.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  const toggleLock = useCallback(async (id, is_locked) => {
    try {
      const res = await apiClient.patch(`/api/events/${id}/lock`, { is_locked })
      setEvents(prev => prev.map(e => e.id === id ? res.data.data : e))
      toast.success(is_locked ? 'Event locked.' : 'Event unlocked.')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to toggle lock.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  const deleteEvent = useCallback(async (id) => {
    try {
      await apiClient.delete(`/api/events/${id}`)
      setEvents(prev => prev.filter(e => e.id !== id))
      toast.success('Event deleted.')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to delete event.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  return { events, loading, error, fetchEvents, updateEvent, toggleLock, deleteEvent }
}
