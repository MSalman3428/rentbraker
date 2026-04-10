import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Maintenance = () => {
    const [records, setRecords] = useState([]);
    const [machines, setMachines] = useState([]);
    const [formData, setFormData] = useState({ machineId: '', date: '', issue: '', cost: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [recordsRes, machinesRes] = await Promise.all([
                axios.get(`${API_URL}/api/maintenance`),
                axios.get(`${API_URL}/api/machines`)
            ]);
            setRecords(recordsRes.data);
            setMachines(machinesRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/maintenance`, formData);
            setFormData({ machineId: '', date: '', issue: '', cost: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Maintenance Logging</h1>
            <div className="glass-panel" style={{ marginBottom: '32px' }}>
                <h3>Add Maintenance Record</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <select value={formData.machineId} onChange={e => setFormData({...formData, machineId: e.target.value})} required>
                        <option value="">Select Machine</option>
                        {machines.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                    </select>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                    <input placeholder="Issue Description" value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} required />
                    <input type="number" placeholder="Cost ($)" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} required />
                    <button type="submit" className="btn btn-primary">Log Maintenance</button>
                </form>
            </div>

            <div className="glass-panel">
                <h3>Maintenance History</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Machine</th>
                            <th>Date</th>
                            <th>Issue</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(r => (
                            <tr key={r._id}>
                                <td>{r.machineId?.name || 'N/A'}</td>
                                <td>{new Date(r.date).toLocaleDateString()}</td>
                                <td>{r.issue}</td>
                                <td>${r.cost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Maintenance;