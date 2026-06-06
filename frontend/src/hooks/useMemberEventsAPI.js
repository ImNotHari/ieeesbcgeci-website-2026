// src/hooks/useMemberEventsAPI.js
import { useState, useCallback } from 'react'
import apiClient from '../lib/apiClient'
import toast     from 'react-hot-toast'

export function useMemberEventsAPI() {
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const fetchMyEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/api/member/events')
      setEvents(res.data.data)
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to fetch your events.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEvent = useCallback(async (id) => {
    try {
      const res = await apiClient.get(`/api/member/events/${id}`)
      return { success: true, data: res.data.data }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to fetch event.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  const createEvent = useCallback(async (eventPayload) => {
    try {
      const res = await apiClient.post('/api/member/events', eventPayload)
      const newEvent = res.data.data
      setEvents(prev => [newEvent, ...prev])
      toast.success('Event created successfully.')
      return { success: true, data: newEvent }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create event.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  const updateEvent = useCallback(async (id, eventPayload) => {
    try {
      await apiClient.put(`/api/member/events/${id}`, eventPayload)
      const res = await apiClient.get('/api/member/events')
      setEvents(res.data.data)
      toast.success('Event updated successfully.')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update event.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  const deleteEvent = useCallback(async (id) => {
    try {
      await apiClient.delete(`/api/member/events/${id}`)
      setEvents(prev => prev.filter(e => e.id !== id))
      toast.success('Event deleted.')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to delete event.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  const uploadFile = useCallback(async (eventId, file, fileType) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_type', fileType)

      const res = await apiClient.post(
        `/api/member/events/${eventId}/files`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      toast.success('File uploaded.')
      return { success: true, data: res.data.data }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to upload file.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  const deleteFile = useCallback(async (eventId, fileId) => {
    try {
      await apiClient.delete(`/api/member/events/${eventId}/files/${fileId}`)
      toast.success('File deleted.')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to delete file.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  return {
    events, loading, error,
    fetchMyEvents, fetchEvent, createEvent, updateEvent, deleteEvent,
    uploadFile, deleteFile
  }
}
