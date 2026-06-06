import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function MemberLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out.')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-bg-dark flex relative">
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-3 left-4 z-50 p-2 bg-bg-deeper border border-border-subtle text-text-primary rounded-btn min-h-[48px] min-w-[48px] flex items-center justify-center shadow-lg"
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30 animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-300 fixed md:relative
        w-64 h-screen md:h-auto bg-bg-card border-r border-border-subtle
        flex flex-col z-40
      `}>
        <div className="p-6 border-b border-border-subtle pt-20 md:pt-6">
          <p className="text-text-muted font-mono text-xs tracking-widest uppercase mb-1">
            IEEE CS SBC GECI
          </p>
          <h2 className="text-text-primary font-bold text-lg">Member Portal</h2>
        </div>

        <nav className="flex-1 p-4" aria-label="Member navigation">
          <ul className="space-y-1">
            {[
              { to: '/dashboard',         label: 'My Events'   },
              { to: '/dashboard/profile', label: 'Profile'     },
            ].map(({ to, label }) => {
              const isActive = location.pathname === to
              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-4 py-3 text-sm font-mono rounded-btn transition-all duration-hover min-h-[48px] flex items-center ${
                      isActive 
                        ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20' 
                        : 'text-text-secondary hover:text-accent-cyan hover:bg-bg-deeper'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border-subtle">
          <div className="mb-4">
            <p className="text-sm font-bold text-text-primary truncate">{user?.email}</p>
            <p className="text-xs text-text-muted font-mono capitalize">Role: {user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-btn font-mono text-sm transition-colors min-h-[48px]"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 bg-bg-card border-b border-border-subtle flex items-center px-16 md:px-8 flex-shrink-0">
          <h1 className="text-xl font-bold text-text-primary truncate">
            {location.pathname === '/dashboard/profile' ? 'My Profile' : 'My Events'}
          </h1>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
