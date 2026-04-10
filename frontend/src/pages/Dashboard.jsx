import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({ machines: 0, customers: 0, rentals: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const machinesRes = await axios.get('http://localhost:5000/api/machines');
                const statsData = {
                    machines: machinesRes.data.length,
                    activeMachines: machinesRes.data.filter(m => m.status === 'Rented').length,
                    availableMachines: machinesRes.data.filter(m => m.status === 'Available').length
                };
                setStats(statsData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the RentBreaker Admin Dashboard.</p>
            
            <div className="dashboard-grid" style={{ marginTop: '24px' }}>
                <div className="glass-panel stat-card">
                    <span className="label">Total Machines</span>
                    <span className="value" style={{ color: 'var(--primary)' }}>{stats.machines || 0}</span>
                </div>
                <div className="glass-panel stat-card">
                    <span className="label">Available Machines</span>
                    <span className="value" style={{ color: 'var(--accent)' }}>{stats.availableMachines || 0}</span>
                </div>
                <div className="glass-panel stat-card">
                    <span className="label">Active Rentals</span>
                    <span className="value" style={{ color: 'var(--danger)' }}>{stats.activeMachines || 0}</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
