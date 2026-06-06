// src/components/tables/AdminEventsTable.jsx
import { useState, useEffect } from 'react'
import { useAdminEventsAPI } from '../../hooks/useAdminEventsAPI'
import ContextMenu from '../ui/ContextMenu'
import ConfirmDialog from '../ui/ConfirmDialog'

export default function AdminEventsTable() {
  const { events, loading, error, fetchEvents, toggleLock, deleteEvent } = useAdminEventsAPI()
  const [contextMenu, setContextMenu] = useState({ isOpen: false, position: { x: 0, y: 0 }, event: null })
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, event: null })
  const [lockConfirm, setLockConfirm] = useState({ isOpen: false, event: null })
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const handleRowClick = (e, event) => {
    e.preventDefault()
    const x = Math.min(e.clientX, window.innerWidth - 200)
    const y = Math.min(e.clientY, window.innerHeight - 200)
    setContextMenu({ isOpen: true, position: { x, y }, event })
  }

  const contextMenuOptions = contextMenu.event ? [
    {
      label: contextMenu.event.is_locked ? 'Unlock Event' : 'Lock Event',
      action: () => setLockConfirm({ isOpen: true, event: contextMenu.event })
    },
    {
      label: 'Delete Event',
      danger: true,
      action: () => setDeleteConfirm({ isOpen: true, event: contextMenu.event })
    }
  ] : []

  const handleDelete = async () => {
    setActionLoading(true)
    await deleteEvent(deleteConfirm.event.id)
    setActionLoading(false)
    setDeleteConfirm({ isOpen: false, event: null })
  }

  const handleToggleLock = async () => {
    setActionLoading(true)
    await toggleLock(lockConfirm.event.id, !lockConfirm.event.is_locked)
    setActionLoading(false)
    setLockConfirm({ isOpen: false, event: null })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Events Overview</h1>
          <p className="text-text-muted font-mono text-xs mt-1">
            {events.length} event{events.length !== 1 ? 's' : ''} in the system
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-400 rounded-sm p-4 mb-4 text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-sm overflow-hidden animate-fadeIn">
        <div className="overflow-x-auto">
          <div className="md:hidden text-text-muted font-mono text-[10px] text-right p-2 bg-inner border-b border-border uppercase tracking-widest">
            👉 Scroll right to see more
          </div>
          <table className="w-full text-sm" role="grid">
            <thead>
              <tr className="border-b border-border">
                {['Title', 'Creator', 'Date Created', 'Lock Status', 'Published', ''].map((col) => (
                  <th key={col} className="text-left px-6 py-4 text-text-muted font-mono text-xs tracking-widest uppercase">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted font-mono text-sm">Loading events...</td></tr>
              )}
              {!loading && events.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted font-mono text-sm">No events found.</td></tr>
              )}
              {!loading && events.map((event) => (
                <tr
                  key={event.id}
                  onClick={(e) => handleRowClick(e, event)}
                  className="border-b border-border cursor-pointer hover:bg-inner transition-hover focus:outline-none focus:bg-inner"
                  tabIndex={0}
                  role="row"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRowClick(e, event) }}
                >
                  <td className="px-6 py-4 text-text-primary font-medium">{event.title}</td>
                  <td className="px-6 py-4 text-text-secondary">{event.profiles?.full_name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-text-secondary font-mono text-xs">{new Date(event.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold ${event.is_locked ? 'bg-red-900/20 text-red-400 border border-red-400/30' : 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30'}`}>
                      {event.is_locked ? 'LOCKED' : 'UNLOCKED'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold ${event.is_published ? 'bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/30' : 'bg-text-muted/20 text-text-muted border border-text-muted/30'}`}>
                      {event.is_published ? 'PUBLIC' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted font-mono text-xs text-right">click to manage →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ContextMenu isOpen={contextMenu.isOpen} position={contextMenu.position} onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))} options={contextMenuOptions} />
      
      <ConfirmDialog isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ isOpen: false, event: null })} onConfirm={handleDelete} title="Delete Event" message={`Permanently delete ${deleteConfirm.event?.title}? This cannot be undone.`} confirmLabel="Delete" isLoading={actionLoading} />
      
      <ConfirmDialog isOpen={lockConfirm.isOpen} onClose={() => setLockConfirm({ isOpen: false, event: null })} onConfirm={handleToggleLock} title={lockConfirm.event?.is_locked ? 'Unlock Event' : 'Lock Event'} message={lockConfirm.event?.is_locked ? `Unlock ${lockConfirm.event?.title}? Members will be able to edit it again.` : `Lock ${lockConfirm.event?.title}? Only admins will be able to edit it.`} confirmLabel={lockConfirm.event?.is_locked ? 'Unlock' : 'Lock'} isLoading={actionLoading} />
    </div>
  )
}
