// src/components/tables/MembersTable.jsx
import { useState, useEffect } from 'react'
import { useMembersAPI } from '../../hooks/useMembersAPI'
import ContextMenu from '../ui/ContextMenu'
import ConfirmDialog from '../ui/ConfirmDialog'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import AddMemberForm from '../forms/AddMemberForm'
import EditMemberForm from '../forms/EditMemberForm'

export default function MembersTable() {
  const {
    members, loading, error,
    fetchMembers, createMember, updateMember,
    updateStatus, resetPassword, deleteMember
  } = useMembersAPI()

  const [contextMenu, setContextMenu] = useState({ isOpen: false, position: { x: 0, y: 0 }, member: null })

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, member: null })
  const [blockConfirm, setBlockConfirm] = useState({ isOpen: false, member: null })
  const [resetConfirm, setResetConfirm] = useState({ isOpen: false, member: null })
  const [tempPasswordModal, setTempPasswordModal] = useState({ isOpen: false, password: '' })
  const [selectedMember, setSelectedMember] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => { fetchMembers() }, [fetchMembers])

  const handleRowClick = (e, member) => {
    e.preventDefault()
    const x = Math.min(e.clientX, window.innerWidth - 200)
    const y = Math.min(e.clientY, window.innerHeight - 200)
    setContextMenu({ isOpen: true, position: { x, y }, member })
  }

  const contextMenuOptions = contextMenu.member ? [
    {
      label: 'Edit Member',
      action: () => { setSelectedMember(contextMenu.member); setEditModalOpen(true) }
    },
    {
      label: 'Reset Password',
      action: () => setResetConfirm({ isOpen: true, member: contextMenu.member })
    },
    {
      label: contextMenu.member.status === 'blocked' ? 'Unblock User' : 'Block User',
      action: () => setBlockConfirm({ isOpen: true, member: contextMenu.member })
    },
    {
      label: 'Delete Member',
      danger: true,
      action: () => setDeleteConfirm({ isOpen: true, member: contextMenu.member })
    }
  ] : []

  const handleCreate = async (formData) => {
    const result = await createMember(formData)
    if (result.success) {
      setAddModalOpen(false)
      setTempPasswordModal({ isOpen: true, password: result.data.temp_password })
    }
    return result
  }

  const handleEdit = async (formData) => {
    const result = await updateMember(selectedMember.id, formData)
    if (result.success) setEditModalOpen(false)
    return result
  }

  const handleDelete = async () => {
    setActionLoading(true)
    await deleteMember(deleteConfirm.member.id)
    setActionLoading(false)
    setDeleteConfirm({ isOpen: false, member: null })
  }

  const handleToggleBlock = async () => {
    setActionLoading(true)
    const newStatus = blockConfirm.member.status === 'blocked' ? 'active' : 'blocked'
    await updateStatus(blockConfirm.member.id, newStatus)
    setActionLoading(false)
    setBlockConfirm({ isOpen: false, member: null })
  }

  const handleResetPassword = async () => {
    setActionLoading(true)
    const result = await resetPassword(resetConfirm.member.id)
    setActionLoading(false)
    setResetConfirm({ isOpen: false, member: null })
    if (result.success) {
      setTempPasswordModal({ isOpen: true, password: result.temp_password })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Members</h1>
          <p className="text-text-muted font-mono text-xs mt-1">
            {members.length} member{members.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          + Add Member
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-400 rounded-sm p-4 mb-4 text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="grid">
            <thead>
              <tr className="border-b border-border">
                {['Name', 'Email', 'IEEE No.', 'Semester', 'Status', ''].map((col) => (
                  <th key={col} className="text-left px-6 py-4 text-text-muted font-mono text-xs tracking-widest uppercase">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted font-mono text-sm">Loading members...</td></tr>
              )}
              {!loading && members.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted font-mono text-sm">No members yet. Click "Add Member" to get started.</td></tr>
              )}
              {!loading && members.map((member) => (
                <tr
                  key={member.id}
                  onClick={(e) => handleRowClick(e, member)}
                  className="border-b border-border cursor-pointer hover:bg-inner transition-hover focus:outline-none focus:bg-inner"
                  tabIndex={0}
                  role="row"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRowClick(e, member) }}
                >
                  <td className="px-6 py-4 text-text-primary font-medium">{member.full_name}</td>
                  <td className="px-6 py-4 text-text-secondary font-mono text-xs">{member.email}</td>
                  <td className="px-6 py-4 text-text-secondary font-mono text-xs">{member.ieee_number}</td>
                  <td className="px-6 py-4 text-text-secondary">{member.semester}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold ${member.status === 'active' ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30' : 'bg-red-900/20 text-red-400 border border-red-400/30'}`}>
                      {member.status}
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
      
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Member">
        <AddMemberForm onSubmit={handleCreate} onCancel={() => setAddModalOpen(false)} />
      </Modal>

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Member">
        {selectedMember && <EditMemberForm member={selectedMember} onSubmit={handleEdit} onCancel={() => setEditModalOpen(false)} />}
      </Modal>

      <ConfirmDialog isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ isOpen: false, member: null })} onConfirm={handleDelete} title="Delete Member" message={`Permanently delete ${deleteConfirm.member?.full_name}?`} confirmLabel="Delete" isLoading={actionLoading} />
      
      <ConfirmDialog isOpen={blockConfirm.isOpen} onClose={() => setBlockConfirm({ isOpen: false, member: null })} onConfirm={handleToggleBlock} title={blockConfirm.member?.status === 'blocked' ? 'Unblock Member' : 'Block Member'} message={blockConfirm.member?.status === 'blocked' ? `Restore access for ${blockConfirm.member?.full_name}?` : `Block ${blockConfirm.member?.full_name}?`} confirmLabel={blockConfirm.member?.status === 'blocked' ? 'Unblock' : 'Block'} isLoading={actionLoading} />
      
      <ConfirmDialog isOpen={resetConfirm.isOpen} onClose={() => setResetConfirm({ isOpen: false, member: null })} onConfirm={handleResetPassword} title="Reset Password" message={`Generate a new temporary password for ${resetConfirm.member?.full_name}?`} confirmLabel="Reset Password" isLoading={actionLoading} />

      <Modal isOpen={tempPasswordModal.isOpen} onClose={() => setTempPasswordModal({ isOpen: false, password: '' })} title="Temporary Password" width="max-w-sm">
        <p className="text-text-secondary text-sm mb-4">Share this password with the member securely. It will not be shown again.</p>
        <div className="bg-inner border border-accent-cyan rounded-sm px-4 py-3 font-mono text-accent-cyan text-lg tracking-widest text-center mb-6">
          {tempPasswordModal.password}
        </div>
        <Button className="w-full" onClick={() => setTempPasswordModal({ isOpen: false, password: '' })}>Done</Button>
      </Modal>
    </div>
  )
}
