import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out.');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg flex relative">

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-inner border border-border text-text-primary rounded-sm min-h-[48px] min-w-[48px] flex items-center justify-center shadow-lg"
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
        w-64 h-screen md:h-auto bg-card border-r border-border
        flex flex-col z-40
      `}>
        <div className="p-6 border-b border-border pt-20 md:pt-6">
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
                  onClick={() => setSidebarOpen(false)}
                  className="
                    block px-4 py-3 text-text-secondary text-sm font-mono
                    hover:text-accent-cyan hover:bg-inner
                    rounded-sm transition-hover min-h-[48px] flex items-center
                  "
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-border">
          <p className="text-text-muted font-mono text-xs truncate mb-3" title={user?.email}>
            {user?.email}
          </p>
          <button
            onClick={handleLogout}
            className="
              w-full border border-border text-text-secondary text-sm
              font-mono py-2 rounded-sm hover:border-red-400 hover:text-red-400
              transition-hover min-h-[48px]
            "
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-bg flex flex-col h-screen">
        <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-auto mt-16 md:mt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
