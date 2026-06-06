import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import AdminRoutes from './routes/AdminRoutes';
import MemberRoutes from './routes/MemberRoutes';
import AdminLayout from './layouts/AdminLayout';
import MemberLayout from './layouts/MemberLayout';

import AdminDashboard from './pages/admin/Dashboard';
import AdminMembers from './pages/admin/Members';
import AdminEvents from './pages/admin/Events';

import MemberDashboard from './pages/member/Dashboard';
import MemberProfile from './pages/member/Profile';

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
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#00D9FF', secondary: '#0A0E1A' } },
          error: { iconTheme: { primary: '#FF4444', secondary: '#FFFFFF' } },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<div className="p-8"><h1 className="text-3xl font-bold">Home Page</h1><a href="/login" className="text-accent-cyan hover:underline mt-4 inline-block">Login</a></div>} />
        <Route path="/about" element={<div className="p-8"><h1>About Us</h1></div>} />
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
    </Router>
  );
}

export default App;
