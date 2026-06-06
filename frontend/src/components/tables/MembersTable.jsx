import { useState, useEffect, useMemo, memo } from 'react'
import { useMembersAPI } from '../../hooks/useMembersAPI'
import ContextMenu from '../ui/ContextMenu'
import ConfirmDialog from '../ui/ConfirmDialog'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import AddMemberForm from '../forms/AddMemberForm'
import EditMemberForm from '../forms/EditMemberForm'

const MemberRow = memo(({ member, onRowClick }) => (
  <tr
    onClick={(e) => onRowClick(e, member)}
    className="list-item border-b border-border cursor-pointer hover:bg-inner transition-hover focus:outline-none focus:bg-inner"
    tabIndex={0}
    role="row"
    onKeyDown={(e) => { if (e.key === 'Enter') onRowClick(e, member) }}
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
    <td className="px-6 py-4 text-text-muted font-mono text-xs text-right">manage →</td>
  </tr>
))

export default function MembersTable() {
  const {
    members, loading, error,
    fetchMembers, createMember, updateMember,
    updateStatus, resetPassword, deleteMember
  } = useMembersAPI()

  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

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

  const processedMembers = useMemo(() => {
    let result = members

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(m =>
        m.full_name?.toLowerCase().includes(term) ||
        m.email?.toLowerCase().includes(term) ||
        m.ieee_number?.toLowerCase().includes(term) ||
        m.semester?.toLowerCase().includes(term)
      )
    }

    result.sort((a, b) => {
      let aVal = a[sortField] || ''
      let bVal = b[sortField] || ''
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase() }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [members, searchTerm, sortField, sortDirection])

  const totalPages = Math.ceil(processedMembers.length / pageSize)

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return processedMembers.slice(start, start + pageSize)
  }, [processedMembers, currentPage, pageSize])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleRowClick = (e, member) => {
    e.preventDefault()
    const x = Math.min(e.clientX, window.innerWidth - 200)
    const y = Math.min(e.clientY, window.innerHeight - 200)
    setContextMenu({ isOpen: true, position: { x, y }, member })
  }

  const contextMenuOptions = contextMenu.member ? [
    { label: 'Edit Member', action: () => { setSelectedMember(contextMenu.member); setEditModalOpen(true) } },
    { label: 'Reset Password', action: () => setResetConfirm({ isOpen: true, member: contextMenu.member }) },
    { label: contextMenu.member.status === 'blocked' ? 'Unblock User' : 'Block User', action: () => setBlockConfirm({ isOpen: true, member: contextMenu.member }) },
    { label: 'Delete Member', danger: true, action: () => setDeleteConfirm({ isOpen: true, member: contextMenu.member }) }
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
    if (result.success) setTempPasswordModal({ isOpen: true, password: result.temp_password })
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Members</h1>
          <p className="text-text-muted font-mono text-xs mt-1">
            {processedMembers.length} of {members.length} member{members.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          + Add Member
        </Button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search members by name, email, IEEE #, or semester..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
          className="w-full bg-inner border border-border rounded-sm px-4 py-3 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-cyan focus:shadow-focus-cyan transition-hover min-h-[48px]"
        />
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-400 rounded-sm p-4 mb-4 text-red-400 text-sm font-mono animate-fadeIn">
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="md:hidden text-text-muted font-mono text-[10px] text-right p-2 bg-inner border-b border-border uppercase tracking-widest">
            👉 Scroll right to see more
          </div>
          <table className="w-full text-sm" role="grid">
            <thead>
              <tr className="border-b border-border bg-inner">
                {[
                  { key: 'full_name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'ieee_number', label: 'IEEE No.' },
                  { key: 'semester', label: 'Semester' },
                  { key: 'status', label: 'Status' },
                  { key: null, label: '' },
                ].map((col, i) => (
                  <th
                    key={i}
                    onClick={() => col.key && handleSort(col.key)}
                    className={`text-left px-6 py-4 text-text-muted font-mono text-xs tracking-widest uppercase ${col.key ? 'cursor-pointer hover:text-accent-cyan transition-colors' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {sortField === col.key && (
                        <span className="text-accent-cyan">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted font-mono text-sm">Loading members...</td></tr>
              )}
              {!loading && members.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-text-muted font-mono text-sm mb-4">No members have been created yet.</div>
                    <Button onClick={() => setAddModalOpen(true)}>Create the first member</Button>
                  </td>
                </tr>
              )}
              {!loading && members.length > 0 && paginatedMembers.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted font-mono text-sm">No members match your search.</td></tr>
              )}
              {!loading && paginatedMembers.map((member) => (
                <MemberRow key={member.id} member={member} onRowClick={handleRowClick} />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && processedMembers.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border bg-inner gap-4">
            <div className="flex items-center gap-4">
              <label className="text-text-secondary text-xs font-mono">
                Rows per page:
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(parseInt(e.target.value)); setCurrentPage(1) }}
                  className="ml-2 bg-bg border border-border rounded-sm px-2 py-1 text-text-primary focus:outline-none focus:border-accent-cyan"
                >
                  {[10, 25, 50].map(size => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
              <span className="text-text-muted text-xs font-mono hidden sm:inline">
                {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, processedMembers.length)} of {processedMembers.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-border rounded-sm text-text-secondary text-xs hover:border-accent-cyan disabled:opacity-50 transition-colors min-h-[32px]"
              >
                ← Prev
              </button>
              <span className="text-text-muted text-xs font-mono mx-2">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border border-border rounded-sm text-text-secondary text-xs hover:border-accent-cyan disabled:opacity-50 transition-colors min-h-[32px]"
              >
                Next →
              </button>
            </div>
          </div>
        )}
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
