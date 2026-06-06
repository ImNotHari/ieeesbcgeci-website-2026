// src/components/forms/EditMemberForm.jsx
import { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function EditMemberForm({ member, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    full_name: member.full_name || '',
    email: member.email || '',
    ieee_number: member.ieee_number || '',
    semester: member.semester || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit(formData)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="edit_full_name"
        label="Full Name"
        required
        value={formData.full_name}
        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
      />
      <Input
        id="edit_email"
        type="email"
        label="Email"
        required
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
      />
      <Input
        id="edit_ieee_number"
        label="IEEE Number"
        required
        value={formData.ieee_number}
        onChange={e => setFormData({ ...formData, ieee_number: e.target.value })}
      />
      <Input
        id="edit_semester"
        label="Semester"
        required
        value={formData.semester}
        onChange={e => setFormData({ ...formData, semester: e.target.value })}
      />
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
      </div>
    </form>
  )
}
