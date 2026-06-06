import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" />
      {/* TODO Phase 2: Add AuthGuard wrapper around /admin and /dashboard routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<div className="p-8"><h1 className="text-3xl font-bold">Home Page</h1></div>} />
        <Route path="/about" element={<div className="p-8"><h1>About Us</h1></div>} />
        
        {/* Protected Routes (Phase 2 & 3) */}
        <Route path="/admin" element={<div className="p-8"><h1>Admin Dashboard</h1></div>} />
        <Route path="/dashboard" element={<div className="p-8"><h1>Member Dashboard</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;
