import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out.');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg flex">

      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <p className="text-text-muted font-mono text-xs tracking-widest uppercase mb-1">
            IEEE CS SBC GECI
          </p>
          <h2 className="text-text-primary font-bold text-lg">Admin Panel</h2>
        </div>

        <nav className="flex-1 p-4" aria-label="Admin navigation">
          <ul className="space-y-1">
            {[
              { to: '/admin', label: 'Dashboard' },
              { to: '/admin/members', label: 'Members' },
              { to: '/admin/events', label: 'Events' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="
                    block px-4 py-3 text-text-secondary text-sm font-mono
                    hover:text-accent-cyan hover:bg-inner
                    rounded-sm transition-hover
                  "
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info + logout at bottom of sidebar */}
        <div className="p-4 border-t border-border">
          <p className="text-text-muted font-mono text-xs truncate mb-3" title={user?.email}>
            {user?.email}
          </p>
          <button
            onClick={handleLogout}
            className="
              w-full border border-border text-text-secondary text-sm
              font-mono py-2 rounded-sm hover:border-red-400 hover:text-red-400
              transition-hover
            "
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-bg">
        <Outlet />
      </main>
    </div>
  );
}
