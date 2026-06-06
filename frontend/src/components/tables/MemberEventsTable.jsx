import { useState } from 'react'
import Button from '../ui/Button'
import ContextMenu from '../ui/ContextMenu'

export default function MemberEventsTable({ events, onEdit, onDelete, onView }) {
  const [contextMenu, setContextMenu] = useState(null)

  const handleContextMenu = (e, eventRecord) => {
    e.preventDefault()
    setContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
      eventRecord
    })
  }

  const closeMenu = () => setContextMenu(null)

  return (
    <div className="bg-bg-card border border-border-subtle rounded-panel overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-deeper border-b border-border-subtle">
              <th className="px-6 py-4 text-xs font-mono text-text-muted tracking-widest uppercase w-1/3">Event Name</th>
              <th className="px-6 py-4 text-xs font-mono text-text-muted tracking-widest uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-mono text-text-muted tracking-widest uppercase">Venue & Mode</th>
              <th className="px-6 py-4 text-xs font-mono text-text-muted tracking-widest uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-mono text-text-muted tracking-widest uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {events.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-text-muted font-mono">
                  You have no events yet.
                </td>
              </tr>
            ) : (
              events.map((evt) => {
                const isLocked = evt.is_locked
                const isPublished = evt.is_published

                return (
                  <tr 
                    key={evt.id} 
                    className="hover:bg-bg-deeper/50 transition-colors duration-hover cursor-context-menu"
                    onContextMenu={(e) => handleContextMenu(e, evt)}
                    onClick={(e) => {
                      // Allow left click to open menu as well for accessibility
                      handleContextMenu(e, evt)
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-text-primary font-bold text-sm">{evt.name}</span>
                        {evt.profiles?.full_name && (
                          <span className="text-text-muted text-xs font-mono mt-1">Creator: {evt.profiles.full_name}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm font-mono">
                      {new Date(evt.date_start).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm">
                      <span className="block truncate max-w-[150px]">{evt.venue}</span>
                      <span className="text-xs font-mono text-text-muted capitalize">{evt.mode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        {isLocked ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-red-400/10 text-red-400 border border-red-400/20">
                            Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-green-400/10 text-green-400 border border-green-400/20">
                            Editable
                          </span>
                        )}
                        {isPublished && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                            Published
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" onClick={(e) => { e.stopPropagation(); onView(evt); }} className="text-xs py-1 px-2">
                        View
                      </Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.mouseX}
          y={contextMenu.mouseY}
          onClose={closeMenu}
          title={contextMenu.eventRecord.name}
        >
          <div className="px-3 py-2 text-xs font-mono text-text-muted border-b border-border-subtle mb-1">
            Status: {contextMenu.eventRecord.is_locked ? 'Locked' : 'Editable'}
          </div>
          
          <button 
            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-deeper hover:text-accent-cyan transition-colors flex items-center"
            onClick={() => { closeMenu(); onView(contextMenu.eventRecord); }}
          >
            View Details
          </button>

          {!contextMenu.eventRecord.is_locked && (
            <button 
              className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-deeper hover:text-accent-cyan transition-colors flex items-center"
              onClick={() => { closeMenu(); onEdit(contextMenu.eventRecord); }}
            >
              Edit Event
            </button>
          )}

          {!contextMenu.eventRecord.is_locked && (
            <button 
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors flex items-center mt-1 border-t border-border-subtle"
              onClick={() => { closeMenu(); onDelete(contextMenu.eventRecord); }}
            >
              Delete Event
            </button>
          )}
        </ContextMenu>
      )}
    </div>
  )
}
