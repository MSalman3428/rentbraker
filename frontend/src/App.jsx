import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { LayoutDashboard, Users, UserCog, CalendarClock, Settings2, LogOut } from 'lucide-react';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Machines from './pages/Machines';
import Customers from './pages/Customers';
import Rentals from './pages/Rentals';
import Maintenance from './pages/Maintenance';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    
    if (roles && !roles.includes(user.role)) {
        return <div>Access Denied. Insufficient permissions.</div>;
    }
    
    return children;
};

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const location = useLocation();
    
    const navItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/machines', label: 'Machines', icon: <Settings2 size={20} /> },
        { path: '/customers', label: 'Customers', icon: <Users size={20} /> },
        { path: '/rentals', label: 'Rentals', icon: <CalendarClock size={20} /> },
        { path: '/maintenance', label: 'Maintenance', icon: <UserCog size={20} /> },
    ];

    return (
        <div className="sidebar">
            <h2 style={{ padding: '0 24px', marginBottom: '32px', color: 'var(--primary)' }}>RentBreaker</h2>
            {navItems.map(item => (
                <Link key={item.path} to={item.path} className={location.pathname === item.path ? 'active' : ''}>
                    {item.icon} {item.label}
                </Link>
            ))}
            <div style={{ flex: 1 }}></div>
            <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
                <LogOut size={20} /> Logout
            </a>
        </div>
    );
};

const AppLayout = ({ children }) => (
    <div className="app-container">
        <Sidebar />
        <div className="main-content">
            {children}
        </div>
    </div>
);

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <AppLayout><Dashboard /></AppLayout>
                </ProtectedRoute>
            } />
            <Route path="/machines" element={
                <ProtectedRoute roles={['Admin', 'Staff']}>
                    <AppLayout><Machines /></AppLayout>
                </ProtectedRoute>
            } />
            <Route path="/customers" element={
                <ProtectedRoute roles={['Admin', 'Staff']}>
                    <AppLayout><Customers /></AppLayout>
                </ProtectedRoute>
            } />
            <Route path="/rentals" element={
                <ProtectedRoute roles={['Admin', 'Staff']}>
                    <AppLayout><Rentals /></AppLayout>
                </ProtectedRoute>
            } />
            <Route path="/maintenance" element={
                <ProtectedRoute roles={['Admin', 'Staff']}>
                    <AppLayout><Maintenance /></AppLayout>
                </ProtectedRoute>
            } />
        </Routes>
    </Router>
  );
}

export default App;
