import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import AdminRoutes from './routes/AdminRoutes';
import MemberRoutes from './routes/MemberRoutes';
import AdminLayout from './layouts/AdminLayout';
import MemberLayout from './layouts/MemberLayout';
import PublicLayout from './layouts/PublicLayout';

const Home        = lazy(() => import('./pages/public/Home'));
const About       = lazy(() => import('./pages/public/About'));
const Execom      = lazy(() => import('./pages/public/Execom'));
const Events      = lazy(() => import('./pages/public/Events'));
const EventDetail = lazy(() => import('./pages/public/EventDetail'));
const Contact     = lazy(() => import('./pages/public/Contact'));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminMembers   = lazy(() => import('./pages/admin/Members'));
const AdminEvents    = lazy(() => import('./pages/admin/Events'));

const MemberDashboard = lazy(() => import('./pages/member/Dashboard'));
const MemberProfile   = lazy(() => import('./pages/member/Profile'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-dark w-full">
      <div className="w-8 h-8 rounded-full border-4 border-accent-cyan/20 border-t-accent-cyan animate-spin"></div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-fadeIn w-full flex-1 flex flex-col">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location}>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/"               element={<Home />} />
            <Route path="/about"          element={<About />} />
            <Route path="/execom"         element={<Execom />} />
            <Route path="/events"         element={<Events />} />
            <Route path="/events/:id"     element={<EventDetail />} />
            <Route path="/contact"        element={<Contact />} />
          </Route>
          
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route element={<AdminRoutes />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/members" element={<AdminMembers />} />
              <Route path="/admin/events" element={<AdminEvents />} />
            </Route>
          </Route>

          {/* Protected Member Routes */}
          <Route element={<MemberRoutes />}>
            <Route element={<MemberLayout />}>
              <Route path="/dashboard" element={<MemberDashboard />} />
              <Route path="/dashboard/profile" element={<MemberProfile />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1A1F3A',
            color: '#FFFFFF',
            border: '1px solid #2A2E4A',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
          },
          success: { iconTheme: { primary: '#00D9FF', secondary: '#0A0E1A' } },
          error: { iconTheme: { primary: '#FF4444', secondary: '#FFFFFF' } },
        }}
      />
      
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
