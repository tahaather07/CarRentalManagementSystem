import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import Inspections from './pages/Inspections';
import Payments from './pages/Payments';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {isAuthenticated && <Sidebar />}
        <div className={`flex-1 ${isAuthenticated ? 'md:ml-64' : ''} min-h-screen overflow-auto`}>
          <Routes>
            <Route path="/login" element={
              !isAuthenticated ? 
                <Login setIsAuthenticated={setIsAuthenticated} /> : 
                <Navigate to="/dashboard" />
            } />
            <Route path="/dashboard" element={
              isAuthenticated ? 
                <Dashboard /> : 
                <Navigate to="/login" />
            } />
            <Route path="/bookings" element={
              isAuthenticated ? 
                <Bookings /> : 
                <Navigate to="/login" />
            } />
            <Route path="/inspections" element={
              isAuthenticated ? 
                <Inspections /> : 
                <Navigate to="/login" />
            } />
            <Route path="/payments" element={
              isAuthenticated ? 
                <Payments /> : 
                <Navigate to="/login" />
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
