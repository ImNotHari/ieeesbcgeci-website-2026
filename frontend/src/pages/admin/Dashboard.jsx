// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from 'react'
import apiClient from '../../lib/apiClient'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState({ members: 0, events: 0 })
  
  // This is a quick mock up of fetching lengths since we don't have a dedicated /stats route yet.
  // In a real app we'd build an aggregation route.
  useEffect(() => {
    async function fetchStats() {
      try {
        const [membersRes, eventsRes] = await Promise.all([
          apiClient.get('/api/members'),
          apiClient.get('/api/events')
        ])
        setStats({
          members: membersRes.data.data.length,
          events: eventsRes.data.data.length
        })
      } catch (e) {
        console.error('Failed to fetch stats')
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
        <p className="text-text-muted mt-2">Welcome to the control center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-sm p-6">
          <h2 className="text-text-secondary font-mono text-xs uppercase tracking-widest mb-2">Total Members</h2>
          <p className="text-4xl font-bold text-accent-cyan mb-4">{stats.members}</p>
          <Link to="/admin/members" className="text-accent-cyan hover:underline text-sm">Manage Members →</Link>
        </div>
        
        <div className="bg-card border border-border rounded-sm p-6">
          <h2 className="text-text-secondary font-mono text-xs uppercase tracking-widest mb-2">Total Events</h2>
          <p className="text-4xl font-bold text-accent-cyan mb-4">{stats.events}</p>
          <Link to="/admin/events" className="text-accent-cyan hover:underline text-sm">Manage Events →</Link>
        </div>
      </div>
    </div>
  )
}
