import { useState, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
})

export function usePublicAPI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPublishedEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await publicClient.get('/api/public/events')
      return { success: true, data: res.data.data }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to fetch events.'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEvent = useCallback(async (id) => {
    try {
      const res = await publicClient.get(`/api/public/events/${id}`)
      return { success: true, data: res.data.data }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Event not found.' }
    }
  }, [])

  const fetchExecom = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await publicClient.get('/api/public/execom')
      return { success: true, data: res.data.data }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to fetch execom.'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const submitContact = useCallback(async (name, email, message) => {
    try {
      const res = await publicClient.post('/api/public/contact', { name, email, message })
      toast.success(res.data.message)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to send message.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }, [])

  return { loading, error, fetchPublishedEvents, fetchEvent, fetchExecom, submitContact }
}
