import { useEffect, useState } from 'react'
import { useMemberEventsAPI } from '../../hooks/useMemberEventsAPI'
import MemberEventsTable from '../../components/tables/MemberEventsTable'
import EventForm from '../../components/forms/EventForm'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

export default function MemberDashboard() {
  const { 
    events, loading, error, 
    fetchMyEvents, createEvent, updateEvent, deleteEvent 
  } = useMemberEventsAPI()

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)

  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewingEvent, setViewingEvent] = useState(null)

  useEffect(() => {
    fetchMyEvents()
  }, [fetchMyEvents])

  const openCreateModal = () => {
    setEditingEvent(null)
    setIsFormModalOpen(true)
  }

  const openEditModal = (evt) => {
    setEditingEvent(evt)
    setIsFormModalOpen(true)
  }

  const closeFormModal = () => {
    setIsFormModalOpen(false)
    setEditingEvent(null)
  }

  const handleFormSubmit = async (payload) => {
    let result
    if (editingEvent) {
      result = await updateEvent(editingEvent.id, payload)
    } else {
      result = await createEvent(payload)
    }
    
    if (result.success) {
      closeFormModal()
    }
    return result
  }

  const openDeleteModal = (evt) => {
    setEventToDelete(evt)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!eventToDelete) return
    await deleteEvent(eventToDelete.id)
    setIsDeleteModalOpen(false)
    setEventToDelete(null)
  }

  const openViewModal = (evt) => {
    setViewingEvent(evt)
    setIsViewModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-bg-card p-6 rounded-panel border border-border-subtle shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Events</h1>
          <p className="text-text-secondary text-sm mt-1">Manage events you created or collaborate on.</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          + Create New Event
        </Button>
      </div>

      {loading && events.length === 0 ? (
        <div className="text-center py-12 text-text-muted font-mono animate-pulse">Loading events...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-400 font-mono">Error: {error}</div>
      ) : (
        <MemberEventsTable 
          events={events}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onView={openViewModal}
        />
      )}

      {/* Create/Edit Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={editingEvent ? "Edit Event" : "Create New Event"}
      >
        <EventForm 
          event={editingEvent}
          onSubmit={handleFormSubmit}
          onCancel={closeFormModal}
          isLoading={loading}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Event?"
        message={`Are you sure you want to delete the event "${eventToDelete?.name}"? This action cannot be undone and will permanently erase all budgets, files, and collaborator records.`}
        confirmText="Yes, Delete"
      />

      {/* View Event Detail Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Event Overview"
      >
        {viewingEvent && (
          <div className="space-y-4 text-sm text-text-secondary">
            <h3 className="text-xl font-bold text-text-primary">{viewingEvent.name}</h3>
            <p className="whitespace-pre-wrap">{viewingEvent.description || 'No description provided.'}</p>
            <div className="grid grid-cols-2 gap-4 mt-4 font-mono">
              <div><strong className="text-text-primary">Start:</strong> {viewingEvent.date_start}</div>
              <div><strong className="text-text-primary">End:</strong> {viewingEvent.date_end}</div>
              <div><strong className="text-text-primary">Venue:</strong> {viewingEvent.venue}</div>
              <div><strong className="text-text-primary">Mode:</strong> {viewingEvent.mode}</div>
              <div><strong className="text-text-primary">Status:</strong> {viewingEvent.is_locked ? 'Locked by Admin' : 'Editable'}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
