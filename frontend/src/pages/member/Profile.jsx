import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'
import apiClient from '../../lib/apiClient'

export default function MemberProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    // Phase 4: Fetch user profile (this needs to be an endpoint in the future)
    // For now we'll just mock it with the user object from auth
    if (user) {
      setProfile({
        full_name: user.full_name || 'Member Name',
        email: user.email,
        ieee_number: user.ieee_number || 'N/A',
        role: user.role
      })
    }
    setLoading(false)
  }, [user])

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    setUpdating(true)
    try {
      // Calls the auth endpoint to update password
      await apiClient.put('/api/auth/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      toast.success('Password updated successfully')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div className="text-text-muted animate-pulse">Loading profile...</div>

  return (
    <div className="max-w-2xl space-y-8">
      {/* Profile Details (Read Only for now) */}
      <section className="bg-bg-card border border-border-subtle rounded-panel p-6 shadow-md">
        <h2 className="text-xl font-bold text-text-primary mb-4 border-b border-border-subtle pb-4">My Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Full Name</label>
            <p className="text-text-primary mt-1 text-lg">{profile?.full_name}</p>
          </div>
          <div>
            <label className="text-xs font-mono text-text-muted uppercase tracking-wider">IEEE Number</label>
            <p className="text-text-primary mt-1 font-mono">{profile?.ieee_number}</p>
          </div>
          <div>
            <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Email Address</label>
            <p className="text-text-primary mt-1">{profile?.email}</p>
          </div>
          <div>
            <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Account Role</label>
            <p className="text-accent-cyan mt-1 capitalize font-mono">{profile?.role}</p>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-6 font-mono">
          Note: To change your name or IEEE number, please contact an administrator.
        </p>
      </section>

      {/* Change Password */}
      <section className="bg-bg-card border border-border-subtle rounded-panel p-6 shadow-md">
        <h2 className="text-xl font-bold text-text-primary mb-4 border-b border-border-subtle pb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <Input 
            id="current-pwd" 
            label="Current Password" 
            type="password" 
            value={passwords.currentPassword}
            onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
            required
          />
          <Input 
            id="new-pwd" 
            label="New Password" 
            type="password" 
            value={passwords.newPassword}
            onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
            required
          />
          <Input 
            id="confirm-pwd" 
            label="Confirm New Password" 
            type="password" 
            value={passwords.confirmPassword}
            onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
            required
          />
          <Button variant="primary" type="submit" disabled={updating} className="mt-4">
            {updating ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </section>
    </div>
  )
}
