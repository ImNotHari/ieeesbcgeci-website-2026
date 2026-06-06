import { Outlet, Link, useLocation } from 'react-router-dom'

export default function PublicLayout() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'text-accent-cyan font-bold' : 'text-text-secondary hover:text-accent-cyan'

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col font-sans">
      <header className="bg-bg-card border-b border-border-subtle sticky top-0 z-40 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-accent-cyan/10 border border-accent-cyan/30 rounded-md flex flex-col items-center justify-center overflow-hidden group-hover:bg-accent-cyan/20 transition-colors">
              <span className="text-[10px] font-bold text-accent-cyan leading-none mb-0.5">IEEE</span>
              <span className="text-xs font-bold text-text-primary leading-none">CS</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-text-primary font-bold text-sm tracking-wide leading-tight group-hover:text-accent-cyan transition-colors">
                Computer Society
              </div>
              <div className="text-text-muted text-xs font-mono tracking-widest uppercase leading-tight">
                SBC GECI
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { to: '/',           label: 'Home'   },
              { to: '/about',      label: 'About'  },
              { to: '/execom',     label: 'Execom' },
              { to: '/events',     label: 'Events' },
              { to: '/contact',    label: 'Contact' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm tracking-wide transition-colors duration-hover ${isActive(to)}`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile menu could go here, omitting for brevity */}
            <Link
              to="/login"
              className="px-5 py-2.5 bg-accent-cyan text-black text-sm font-bold rounded-btn hover:shadow-glow-cyan hover:-translate-y-0.5 transition-all duration-300"
            >
              Member Login
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-bg-card border-t border-border-subtle mt-16 text-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="text-text-primary font-bold text-lg">
                  IEEE CS SBC GECI
                </div>
              </Link>
              <p className="text-text-secondary leading-relaxed max-w-sm mb-6">
                Fostering technical excellence, innovation, and community among computer science students at Govt. Engineering College, Idukki.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-bg-deeper flex items-center justify-center text-text-muted hover:text-accent-cyan cursor-pointer transition-colors">
                  in
                </div>
                <div className="w-8 h-8 rounded-full bg-bg-deeper flex items-center justify-center text-text-muted hover:text-accent-cyan cursor-pointer transition-colors">
                  ig
                </div>
                <div className="w-8 h-8 rounded-full bg-bg-deeper flex items-center justify-center text-text-muted hover:text-accent-cyan cursor-pointer transition-colors">
                  x
                </div>
              </div>
            </div>

            <div>
              <p className="text-text-primary font-bold tracking-wide mb-4">Quick Links</p>
              <ul className="space-y-3">
                {[
                  { to: '/',        label: 'Home' },
                  { to: '/events',  label: 'Upcoming Events' },
                  { to: '/execom',  label: 'Leadership Team' },
                  { to: '/contact', label: 'Contact Us' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-text-secondary hover:text-accent-cyan transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-text-primary font-bold tracking-wide mb-4">Contact Info</p>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex gap-3">
                  <span className="text-accent-cyan mt-1">📍</span>
                  <span>Dept of Computer Science,<br/>Govt. Engineering College, Idukki</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-cyan mt-1">✉️</span>
                  <a href="mailto:contact@ieeesbcgeci.org" className="hover:text-accent-cyan transition-colors">
                    contact@ieeesbcgeci.org
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted text-xs font-mono">
            <p>&copy; {new Date().getFullYear()} IEEE Computer Society SBC GECI. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/login" className="hover:text-accent-cyan transition-colors">Portal Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
