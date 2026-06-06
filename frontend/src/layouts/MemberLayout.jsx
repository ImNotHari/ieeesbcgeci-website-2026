import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function MemberLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out.')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-bg-dark flex">
      <aside className="w-64 bg-bg-card border-r border-border-subtle flex flex-col">
        <div className="p-6 border-b border-border-subtle">
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
                    className={`block px-4 py-3 text-sm font-mono rounded-btn transition-all duration-hover ${
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
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-btn font-mono text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 bg-bg-card border-b border-border-subtle flex items-center px-8 flex-shrink-0">
          <h1 className="text-xl font-bold text-text-primary">
            {location.pathname === '/dashboard/profile' ? 'My Profile' : 'My Events'}
          </h1>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
