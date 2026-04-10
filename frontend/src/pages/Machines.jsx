import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Machines = () => {
    const [machines, setMachines] = useState([]);
    const [formData, setFormData] = useState({ name: '', capacity: '', rentalPricePerDay: '', location: '' });

    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/machines');
            setMachines(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/machines', formData);
            setFormData({ name: '', capacity: '', rentalPricePerDay: '', location: '' });
            fetchMachines();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Machine Management</h1>
            <div className="glass-panel" style={{ marginBottom: '32px' }}>
                <h3>Add New Machine</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <input placeholder="Machine Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    <input placeholder="Capacity" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required />
                    <input type="number" placeholder="Price/Day" value={formData.rentalPricePerDay} onChange={e => setFormData({...formData, rentalPricePerDay: e.target.value})} required />
                    <input placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                    <button type="submit" className="btn btn-primary">Add Machine</button>
                </form>
            </div>

            <div className="glass-panel">
                <h3>All Machines</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Capacity</th>
                            <th>Price/Day ($)</th>
                            <th>Location</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {machines.map(m => (
                            <tr key={m._id}>
                                <td>{m.name}</td>
                                <td>{m.capacity}</td>
                                <td>{m.rentalPricePerDay}</td>
                                <td>{m.location}</td>
                                <td>
                                    <span style={{ 
                                        color: m.status === 'Available' ? 'var(--accent)' : m.status === 'Rented' ? 'var(--danger)' : 'orange' 
                                    }}>{m.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Machines;
