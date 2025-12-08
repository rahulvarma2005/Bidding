import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUsersCog, FaGavel, FaUsers } from 'react-icons/fa';

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Auction Admin Control</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Create Team */}
          <div 
            onClick={() => navigate('/create-team')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-purple-500 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Create Team</h3>
              <FaUsersCog className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-gray-600">Register new franchises and assign owners.</p>
          </div>

          {/* Card 2: Add Player */}
          <div 
            onClick={() => navigate('/add-player')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-blue-500 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Add Player</h3>
              <FaUserPlus className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-gray-600">Add players to the upcoming auction pool.</p>
          </div>

          {/* Card 3: Manage Players */}
          <div 
            onClick={() => navigate('/players')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-green-500 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Manage Players</h3>
              <FaUsers className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-gray-600">Edit or delete existing players from the pool.</p>
          </div>

          {/* Card 4: Auctioneer Dashboard */}
          <div 
            onClick={() => navigate('/auctioneer')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-red-500 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Live Auction</h3>
              <FaGavel className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-gray-600">Control the live auction flow (Start, Sold, Unsold).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;