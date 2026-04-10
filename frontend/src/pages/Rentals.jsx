import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rentals = () => {
    const [rentals, setRentals] = useState([]);
    const [machines, setMachines] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({ machineId: '', customerId: '', startDate: '', endDate: '', totalRent: '', advancePayment: '', remainingBalance: '' });

    useEffect(() => {
        fetchData();
    }, []);

    // Auto-calculate total rent based on dates and machine price
    useEffect(() => {
        if (formData.machineId && formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            const diffTime = endDate - startDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            const selectedMachine = machines.find(m => m._id === formData.machineId);
            if (selectedMachine && diffDays >= 0) {
                const total = (diffDays === 0 ? 1 : diffDays) * selectedMachine.rentalPricePerDay;
                const advance = parseFloat(formData.advancePayment) || 0;
                const remaining = total - advance;

                setFormData(prev => ({ 
                    ...prev, 
                    totalRent: total,
                    remainingBalance: remaining < 0 ? 0 : remaining
                }));
            }
        }
    }, [formData.machineId, formData.startDate, formData.endDate, formData.advancePayment]);

    const fetchData = async () => {
        try {
            const [rentalsRes, machinesRes, custRes] = await Promise.all([
                axios.get('http://localhost:5000/api/rentals'),
                axios.get('http://localhost:5000/api/machines'),
                axios.get('http://localhost:5000/api/customers')
            ]);
            setRentals(rentalsRes.data);
            setMachines(machinesRes.data.filter(m => m.status === 'Available'));
            setCustomers(custRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/rentals', formData);
            setFormData({ machineId: '', customerId: '', startDate: '', endDate: '', totalRent: '', advancePayment: '', remainingBalance: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const completeRental = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/rentals/${id}`, { status: 'Completed' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Rental Management</h1>
            <div className="glass-panel" style={{ marginBottom: '32px' }}>
                <h3>Book a Machine</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <select value={formData.machineId} onChange={e => setFormData({...formData, machineId: e.target.value})} required>
                        <option value="">Select Machine</option>
                        {machines.map(m => <option key={m._id} value={m._id}>{m.name} - ${m.rentalPricePerDay}/day</option>)}
                    </select>
                    <select value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} required>
                        <option value="">Select Customer</option>
                        {customers.map(c => <option key={c._id} value={c._id}>{c.name} ({c.phone})</option>)}
                    </select>
                    <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required title="Start Date" />
                    <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required title="End Date" />
                    <input type="number" placeholder="Total Rent ($)" value={formData.totalRent} readOnly style={{ background: 'rgba(0,0,0,0.2)', cursor: 'not-allowed' }} title="Auto-calculated Total Rent" />
                    <input type="number" placeholder="Advance Payment ($)" value={formData.advancePayment} onChange={e => setFormData({...formData, advancePayment: e.target.value})} title="Advance Payment" />
                    <input type="number" placeholder="Remaining Balance ($)" value={formData.remainingBalance} readOnly style={{ background: 'rgba(0,0,0,0.2)', cursor: 'not-allowed' }} title="Remaining Balance" />
                    <button type="submit" className="btn btn-primary">Create Booking</button>
                </form>
            </div>

            <div className="glass-panel">
                <h3>Rental Records</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Machine</th>
                            <th>Customer</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Total Rent</th>
                            <th>Advance</th>
                            <th>Balance</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentals.map(r => (
                            <tr key={r._id}>
                                <td>{r.machineId?.name || 'N/A'}</td>
                                <td>{r.customerId?.name || 'N/A'}</td>
                                <td>{new Date(r.startDate).toLocaleDateString()}</td>
                                <td>{new Date(r.endDate).toLocaleDateString()}</td>
                                <td>${r.totalRent}</td>
                                <td>${r.advancePayment || 0}</td>
                                <td>${r.remainingBalance || 0}</td>
                                <td>
                                    <span style={{ color: r.status === 'Completed' ? 'var(--accent)' : 'var(--danger)' }}>
                                        {r.status}
                                    </span>
                                </td>
                                <td>
                                    {r.status !== 'Completed' && (
                                        <button onClick={() => completeRental(r._id)} className="btn btn-accent" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Complete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Rentals;
