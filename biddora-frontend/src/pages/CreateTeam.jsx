import React, { useState } from 'react';
import { FaUsers, FaMoneyBillWave, FaShieldAlt, FaCheck } from 'react-icons/fa';

const CreateTeam = () => {
const [formData, setFormData] = useState({
teamName: '',
acronym: '',
logoUrl: '',
totalPurse: 100000000, // Default 100 Cr (or whatever currency unit)
ownerUsername: ''
});
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);
setMessage('');

try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8081/api/teams', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error('Failed to create team');
    
    setMessage('Team created successfully!');
    setFormData({ teamName: '', acronym: '', logoUrl: '', totalPurse: 100000000, ownerUsername: '' });
} catch (error) {
    setMessage(error.message);
} finally {
    setLoading(false);
}
};

return (
<div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
    <div className="flex items-center mb-6 text-purple-600">
    <FaUsers className="w-8 h-8 mr-3" />
    <h2 className="text-2xl font-bold">Create New Franchise</h2>
    </div>

    {message && (
    <div className={`p-4 mb-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {message}
    </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
        <input
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="e.g. Mumbai Indians"
            required
        />
        </div>
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Acronym</label>
        <input
            name="acronym"
            value={formData.acronym}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="e.g. MI"
            required
        />
        </div>
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Owner Username</label>
        <div className="relative">
        <FaShieldAlt className="absolute left-3 top-3 text-gray-400" />
        <input
            name="ownerUsername"
            value={formData.ownerUsername}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Username of the team owner"
            required
        />
        </div>
        <p className="text-xs text-gray-500 mt-1">Must match an existing registered user.</p>
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Total Purse</label>
        <div className="relative">
        <FaMoneyBillWave className="absolute left-3 top-3 text-gray-400" />
        <input
            type="number"
            name="totalPurse"
            value={formData.totalPurse}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            required
        />
        </div>
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
        <input
        name="logoUrl"
        value={formData.logoUrl}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        placeholder="https://example.com/logo.png"
        />
    </div>

    <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex justify-center items-center"
    >
        {loading ? 'Creating...' : <><FaCheck className="mr-2" /> Create Team</>}
    </button>
    </form>
</div>
);
};

export default CreateTeam;