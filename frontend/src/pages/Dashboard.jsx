import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, ArrowUpRight, Boxes, CircleDollarSign, Wrench } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
    const [stats, setStats] = useState({ machines: 0, activeMachines: 0, availableMachines: 0 });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const machinesRes = await axios.get(`${API_URL}/api/machines`);
                const statsData = {
                    machines: machinesRes.data.length,
                    activeMachines: machinesRes.data.filter(m => m.status === 'Rented').length,
                    availableMachines: machinesRes.data.filter(m => m.status === 'Available').length
                };
                setStats(statsData);
            } catch {
                setError('Could not load live machine data. Check the API connection.');
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <div className="page-heading">
                <div><p className="eyebrow">Monday, 24 August</p><h1>Good morning, operator.</h1><p className="heading-copy">Here is the pulse of your rental fleet.</p></div>
                <button className="btn btn-secondary" onClick={() => window.location.reload()}><Activity size={17} /> Refresh data</button>
            </div>
            {error && <div className="notice notice-error">{error}</div>}
            
            <div className="dashboard-grid" style={{ marginTop: '24px' }}>
                <div className="glass-panel stat-card stat-blue">
                    <div className="stat-icon"><Boxes size={19} /></div>
                    <span className="label">Total Machines</span>
                    <span className="value" style={{ color: 'var(--primary)' }}>{stats.machines || 0}</span>
                </div>
                <div className="glass-panel stat-card stat-green">
                    <div className="stat-icon"><ArrowUpRight size={19} /></div>
                    <span className="label">Available Machines</span>
                    <span className="value" style={{ color: 'var(--accent)' }}>{stats.availableMachines || 0}</span>
                </div>
                <div className="glass-panel stat-card stat-orange">
                    <div className="stat-icon"><Wrench size={19} /></div>
                    <span className="label">Active Rentals</span>
                    <span className="value" style={{ color: 'var(--danger)' }}>{stats.activeMachines || 0}</span>
                </div>
            </div>
            <section className="dashboard-lower">
                <div className="glass-panel activity-panel"><div className="panel-heading"><div><p className="eyebrow">Fleet health</p><h2>Availability overview</h2></div><CircleDollarSign size={22} /></div><div className="availability-row"><span>Available fleet</span><strong>{stats.machines ? Math.round((stats.availableMachines / stats.machines) * 100) : 0}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${stats.machines ? (stats.availableMachines / stats.machines) * 100 : 0}%` }} /></div><p className="muted-small">Keep machines moving and revenue follows.</p></div>
                <div className="glass-panel activity-panel accent-panel"><p className="eyebrow">Quick note</p><h2>Ready for today’s bookings?</h2><p>Review availability before confirming a new rental.</p><a className="text-link" href="/rentals">Open rentals <ArrowUpRight size={15} /></a></div>
            </section>
        </div>
    );
};

export default Dashboard;