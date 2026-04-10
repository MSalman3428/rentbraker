import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({ name: '', phone: '', cnic: '', address: '' });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/customers');
            setCustomers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/customers', formData);
            setFormData({ name: '', phone: '', cnic: '', address: '' });
            fetchCustomers();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Customer Management</h1>
            <div className="glass-panel" style={{ marginBottom: '32px' }}>
                <h3>Add New Customer</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                    <input placeholder="CNIC" value={formData.cnic} onChange={e => setFormData({...formData, cnic: e.target.value})} required />
                    <input placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
                    <button type="submit" className="btn btn-primary">Add Customer</button>
                </form>
            </div>

            <div className="glass-panel">
                <h3>All Customers</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>CNIC</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c._id}>
                                <td>{c.name}</td>
                                <td>{c.phone}</td>
                                <td>{c.cnic}</td>
                                <td>{c.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;
