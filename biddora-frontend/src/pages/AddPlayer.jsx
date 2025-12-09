import React, { useState } from 'react';
import { FaUserPlus, FaGlobe, FaRunning, FaRupeeSign, FaImage } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';

const AddPlayer = () => {
  const [formData, setFormData] = useState({
    name: '',
    nationality: 'INDIAN',
    role: 'BATSMAN',
    basePrice: '',
    stats: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to add player');
      
      setMessage('Player added to auction pool!');
      setFormData({ name: '', nationality: 'INDIAN', role: 'BATSMAN', basePrice: '', stats: '', imageUrl: '' });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex items-center mb-6 text-blue-600">
        <FaUserPlus className="w-8 h-8 mr-3" />
        <h2 className="text-2xl font-bold">Add Player to Pool</h2>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded-lg ${message.includes('added') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Player Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
            <div className="relative">
              <FaGlobe className="absolute left-3 top-3 text-gray-400" />
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="INDIAN">Indian</option>
                <option value="OVERSEAS">Overseas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="relative">
              <FaRunning className="absolute left-3 top-3 text-gray-400" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="BATSMAN">Batsman</option>
                <option value="BOWLER">Bowler</option>
                <option value="ALL_ROUNDER">All Rounder</option>
                <option value="WICKET_KEEPER">Wicket Keeper</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Base Price</label>
          <div className="relative">
            <FaRupeeSign className="absolute left-3 top-3 text-gray-400" />
            <input
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 2000000"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stats (Optional)</label>
          <textarea
            name="stats"
            value={formData.stats}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Matches: 50, Runs: 2000, SR: 140..."
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Player Photo URL (Optional)</label>
          <div className="relative">
            <FaImage className="absolute left-3 top-3 text-gray-400" />
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/player-photo.jpg"
            />
          </div>
          {formData.imageUrl && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-2">Preview:</p>
              <img 
                src={formData.imageUrl} 
                alt="Player preview" 
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          {loading ? 'Adding...' : 'Add Player'}
        </button>
      </form>
    </div>
  );
};

export default AddPlayer;