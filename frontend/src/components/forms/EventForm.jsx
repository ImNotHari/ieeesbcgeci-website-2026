import { useState, useEffect } from 'react'
import Input  from '../ui/Input'
import Button from '../ui/Button'
import toast  from 'react-hot-toast'
import apiClient from '../../lib/apiClient'

export default function EventForm({ event, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState({
    name:         event?.name          || '',
    description:  event?.description   || '',
    date_start:   event?.date_start    || '',
    date_end:     event?.date_end      || '',
    venue:        event?.venue         || '',
    mode:         event?.mode          || '', 
    poster_url:   event?.poster_url    || '',
    collaborators: event?.event_collaborators || [],
    budget_rows:  event?.event_budget || [],
    income_rows:  event?.event_income || [],
    files:        event?.event_files || []
  })

  const [errors,  setErrors]  = useState({})
  const [availableMembers, setAvailableMembers] = useState([])

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await apiClient.get('/api/members')
        setAvailableMembers(res.data.data)
      } catch (err) {
        console.error('Failed to fetch members for collaborators', err)
      }
    }
    // Only admins can fetch all members right now in our backend logic 
    // (/api/members requires admin). 
    // Wait, the members list needs a public or authenticated route. 
    // For Phase 4, we will just stub this out or skip the member dropdown if it's protected.
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim())   e.name   = 'Event name is required.'
    if (!form.venue.trim())  e.venue  = 'Venue is required.'
    if (!form.mode)          e.mode   = 'Please select a mode.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const addBudgetRow = () => {
    setForm(prev => ({
      ...prev,
      budget_rows: [
        ...prev.budget_rows,
        { expenditure_head: '', proposed_amount: 0, actual_amount: 0 }
      ]
    }))
  }

  const removeBudgetRow = (idx) => {
    setForm(prev => ({
      ...prev,
      budget_rows: prev.budget_rows.filter((_, i) => i !== idx)
    }))
  }

  const updateBudgetRow = (idx, field, value) => {
    setForm(prev => {
      const newBudget = [...prev.budget_rows]
      newBudget[idx] = { ...newBudget[idx], [field]: value }
      return { ...prev, budget_rows: newBudget }
    })
  }

  const totalActualBudget = form.budget_rows.reduce(
    (sum, row) => sum + (parseFloat(row.actual_amount) || 0),
    0
  )

  const addIncomeRow = () => {
    setForm(prev => ({
      ...prev,
      income_rows: [...prev.income_rows, { head: '', amount: 0 }]
    }))
  }

  const removeIncomeRow = (idx) => {
    setForm(prev => ({
      ...prev,
      income_rows: prev.income_rows.filter((_, i) => i !== idx)
    }))
  }

  const updateIncomeRow = (idx, field, value) => {
    setForm(prev => {
      const newIncome = [...prev.income_rows]
      newIncome[idx] = { ...newIncome[idx], [field]: value }
      return { ...prev, income_rows: newIncome }
    })
  }

  const totalIncome = form.income_rows.reduce(
    (sum, row) => sum + (parseFloat(row.amount) || 0),
    0
  )

  const handleFileUpload = async (fileInput, fileType) => {
    const file = fileInput.files?.[0]
    if (!file) return

    // In a real app we'd upload directly here or pass it to parent
    // For now we just mock adding it to the form array if creating,
    // or actually call the API if we have an eventId.
    const newFile = {
      id:        Date.now(),
      file_type: fileType,
      file_name: file.name,
      uploaded_at: new Date().toISOString(),
      _rawFile: file // Keep the raw file to upload during submit if creating
    }
    setForm(prev => ({
      ...prev,
      files: [...prev.files, newFile]
    }))
    toast.success('File attached to form. Will be uploaded on save.')
  }

  const removeFile = (fileId) => {
    setForm(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      name:          form.name,
      description:   form.description,
      date_start:    form.date_start,
      date_end:      form.date_end,
      venue:         form.venue,
      mode:          form.mode,
      poster_url:    form.poster_url,
      collaborators: form.collaborators,
      budget_rows:   form.budget_rows,
      income_rows:   form.income_rows,
      _filesToUpload: form.files.filter(f => f._rawFile) 
    }

    const result = await onSubmit(payload)
    if (!result.success) {
      setErrors({ form: result.error })
    }
  }

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <fieldset>
        <legend className="text-lg font-bold text-text-primary mb-4">Event Details</legend>
        <div className="space-y-4">
          <Input
            id="event_name"
            label="Event Name"
            value={form.name}
            onChange={set('name')}
            error={errors.name}
            required
            placeholder="E.g. AITHON 3.0"
          />

          <div>
            <label htmlFor="event_desc" className="block text-text-secondary font-mono text-xs tracking-widest uppercase mb-2">
              Description
            </label>
            <textarea
              id="event_desc"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the event..."
              rows={4}
              className="w-full bg-bg-deeper border border-border-subtle rounded-input px-4 py-3 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-cyan focus:shadow-glow-cyan transition-all duration-hover"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="date_start"
              label="Start Date"
              type="date"
              value={form.date_start}
              onChange={set('date_start')}
            />
            <Input
              id="date_end"
              label="End Date"
              type="date"
              value={form.date_end}
              onChange={set('date_end')}
            />
          </div>

          <Input
            id="venue"
            label="Venue / Location"
            value={form.venue}
            onChange={set('venue')}
            error={errors.venue}
            required
            placeholder="E.g. Department Auditorium, Online"
          />

          <div>
            <label htmlFor="mode" className="block text-text-secondary font-mono text-xs tracking-widest uppercase mb-2">
              Mode of Conduction
              <span className="text-accent-cyan ml-1">*</span>
            </label>
            <select
              id="mode"
              value={form.mode}
              onChange={set('mode')}
              aria-invalid={!!errors.mode}
              className="w-full bg-bg-deeper border border-border-subtle rounded-input px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-accent-cyan focus:shadow-glow-cyan transition-all duration-hover"
            >
              <option value="">Select...</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {errors.mode && (
              <p className="mt-2 text-red-400 text-xs font-mono">{errors.mode}</p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-bold text-text-primary mb-4">
          Event Budget
          <span className="text-text-muted font-mono text-sm font-normal ml-2">
            Total Actual: ₹{totalActualBudget.toLocaleString('en-IN')}
          </span>
        </legend>

        <div className="space-y-3">
          {form.budget_rows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-end">
              <input
                type="text"
                value={row.expenditure_head}
                onChange={(e) => updateBudgetRow(idx, 'expenditure_head', e.target.value)}
                placeholder="E.g. Refreshments"
                className="col-span-4 bg-bg-deeper border border-border-subtle rounded-input px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-cyan"
              />
              <input
                type="number"
                min="0"
                value={row.proposed_amount}
                onChange={(e) => updateBudgetRow(idx, 'proposed_amount', parseFloat(e.target.value) || 0)}
                placeholder="Proposed"
                className="col-span-3 bg-bg-deeper border border-border-subtle rounded-input px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-cyan"
              />
              <input
                type="number"
                min="0"
                value={row.actual_amount}
                onChange={(e) => updateBudgetRow(idx, 'actual_amount', parseFloat(e.target.value) || 0)}
                placeholder="Actual"
                className="col-span-3 bg-bg-deeper border border-border-subtle rounded-input px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-cyan"
              />
              <button
                type="button"
                onClick={() => removeBudgetRow(idx)}
                className="col-span-2 bg-transparent border border-red-400 text-red-400 rounded-input py-2 text-xs font-mono hover:bg-red-400/10 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <Button variant="secondary" onClick={addBudgetRow} className="mt-4">
          + Add Budget Row
        </Button>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-bold text-text-primary mb-4">
          Event Income
          <span className="text-text-muted font-mono text-sm font-normal ml-2">
            Total: ₹{totalIncome.toLocaleString('en-IN')}
          </span>
        </legend>

        <div className="space-y-3">
          {form.income_rows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-end">
              <input
                type="text"
                value={row.head}
                onChange={(e) => updateIncomeRow(idx, 'head', e.target.value)}
                placeholder="E.g. Registration Fees"
                className="col-span-7 bg-bg-deeper border border-border-subtle rounded-input px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-cyan"
              />
              <input
                type="number"
                min="0"
                value={row.amount}
                onChange={(e) => updateIncomeRow(idx, 'amount', parseFloat(e.target.value) || 0)}
                placeholder="Amount"
                className="col-span-3 bg-bg-deeper border border-border-subtle rounded-input px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-cyan"
              />
              <button
                type="button"
                onClick={() => removeIncomeRow(idx)}
                className="col-span-2 bg-transparent border border-red-400 text-red-400 rounded-input py-2 text-xs font-mono hover:bg-red-400/10 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <Button variant="secondary" onClick={addIncomeRow} className="mt-4">
          + Add Income Row
        </Button>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-bold text-text-primary mb-4">Event Documentation</legend>

        <div className="space-y-4">
          {['poster', 'report_pdf', 'photo', 'proceedings', 'press'].map(type => (
            <div key={type}>
              <label className="block text-text-secondary font-mono text-xs tracking-widest uppercase mb-2">
                {type === 'poster' && 'Event Poster (Image)'}
                {type === 'report_pdf' && 'Event Report (PDF)'}
                {type === 'photo' && 'Event Photos (Image)'}
                {type === 'proceedings' && 'Proceedings (PDF)'}
                {type === 'press' && 'Press Coverage (PDF/Image)'}
              </label>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e.target, type)}
                accept={type === 'report_pdf' || type === 'proceedings' || type === 'press' ? '.pdf' : 'image/*'}
                className="block w-full text-sm text-text-muted"
              />
              <div className="mt-2 space-y-1">
                {form.files
                  .filter(f => f.file_type === type)
                  .map(file => (
                    <div key={file.id} className="text-xs text-text-muted font-mono flex items-center justify-between bg-bg-deeper px-3 py-2 rounded-input">
                      <span>{file.file_name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {errors.form && (
        <p className="text-red-400 text-sm font-mono" role="alert">{errors.form}</p>
      )}

      <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle">
        <Button variant="ghost" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : event ? 'Save Changes' : 'Create Event'}
        </Button>
      </div>
    </form>
  )
}
