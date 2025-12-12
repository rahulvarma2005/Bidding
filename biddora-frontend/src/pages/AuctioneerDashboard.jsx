import React, { useState, useEffect } from 'react';
import { FaGavel, FaUser, FaRunning, FaUndo } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';

const AuctioneerDashboard = () => {
const [upcomingPlayers, setUpcomingPlayers] = useState([]);
const [currentPlayer, setCurrentPlayer] = useState(null);
const [unsoldPlayers, setUnsoldPlayers] = useState([]);
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');

// Fetch data on load
useEffect(() => {
fetchPlayers();
const interval = setInterval(fetchPlayers, 5000); // Poll every 5s to stay synced
return () => clearInterval(interval);
}, []);

const fetchPlayers = async () => {
try {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    // 1. Get ON_AUCTION player
    const currentRes = await fetch(`${API_BASE_URL}/api/players/all?status=ON_AUCTION`, { headers });
    const currentData = await currentRes.json();
    if (currentData.content && currentData.content.length > 0) {
    setCurrentPlayer(currentData.content[0]);
    } else {
    setCurrentPlayer(null);
    }

    // 2. Get UPCOMING players
    const upcomingRes = await fetch(`${API_BASE_URL}/api/players/all?status=UPCOMING&size=100`, { headers });
    const upcomingData = await upcomingRes.json();
    setUpcomingPlayers(upcomingData.content || []);

    // 3. Get UNSOLD players
    const unsoldRes = await fetch(`${API_BASE_URL}/api/players/all?status=UNSOLD&size=100`, { headers });
    const unsoldData = await unsoldRes.json();
    setUnsoldPlayers(unsoldData.content || []);

} catch (err) {
    console.error("Error fetching dashboard data", err);
}
};

const handleAction = async (endpoint, playerId) => {
setLoading(true);
setMessage('');
try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/auctioneer/${endpoint}/${playerId}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    });

    if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
    }

    setMessage(`Action ${endpoint} successful!`);
    fetchPlayers(); // Refresh data immediately
} catch (err) {
    setMessage(`Error: ${err.message}`);
} finally {
    setLoading(false);
}
};

return (
<div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center">
    <FaGavel className="mr-4 text-purple-600" /> Auctioneer Control Room
    </h1>

    {message && (
    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
        {message}
    </div>
    )}

    {/* --- SECTION 1: LIVE TABLE --- */}
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-purple-500">
    <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
        CURRENTLY ON TABLE
    </h2>
    
    {currentPlayer ? (
        <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
            <h3 className="text-3xl font-bold">{currentPlayer.name}</h3>
            <p className="text-gray-600 text-lg">{currentPlayer.role} | {currentPlayer.nationality}</p>
            <p className="text-xl font-mono mt-2">Base Price: ₹{currentPlayer.basePrice.toLocaleString('en-IN')}
            </p>
        </div>

        <div className="flex gap-4">
            <button 
            onClick={() => handleAction('sold', currentPlayer.id)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg transform hover:scale-105 transition-all"
            >
            HAMMER DOWN (SOLD)
            </button>
            
            <button 
            onClick={() => handleAction('unsold', currentPlayer.id)}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg transform hover:scale-105 transition-all"
            >
            UNSOLD
            </button>
        </div>
        </div>
    ) : (
        <div className="text-center py-12 text-gray-500 text-xl italic">
        The Auction Table is Empty. Select a player below to start.
        </div>
    )}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* --- SECTION 2: UPCOMING PLAYERS --- */}
    <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaUser className="mr-2 text-blue-500" /> Upcoming Players ({upcomingPlayers.length})
        </h3>
        <div className="overflow-y-auto max-h-[400px] space-y-3">
        {upcomingPlayers.map(player => (
            <div key={player.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
            <div>
                <p className="font-semibold">{player.name}</p>
                <p className="text-xs text-gray-500">{player.role} • ₹{player.basePrice.toLocaleString('en-IN')}
                </p>
            </div>
            <button 
                onClick={() => handleAction('start', player.id)}
                disabled={!!currentPlayer || loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Bring to Table
            </button>
            </div>
        ))}
        {upcomingPlayers.length === 0 && <p className="text-gray-400 text-center py-4">No upcoming players.</p>}
        </div>
    </div>

    {/* --- SECTION 3: UNSOLD POOL --- */}
    <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaUndo className="mr-2 text-orange-500" /> Unsold Pool ({unsoldPlayers.length})
        </h3>
        <div className="overflow-y-auto max-h-[400px] space-y-3">
        {unsoldPlayers.map(player => (
            <div key={player.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <div>
                <p className="font-semibold text-gray-700">{player.name}</p>
                <p className="text-xs text-gray-500">{player.role}</p>
            </div>
            <button 
                onClick={() => handleAction('start', player.id)}
                disabled={!!currentPlayer || loading}
                className="border border-orange-500 text-orange-500 hover:bg-orange-50 px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-50"
            >
                Re-Auction
            </button>
            </div>
        ))}
        {unsoldPlayers.length === 0 && <p className="text-gray-400 text-center py-4">No unsold players.</p>}
        </div>
    </div>
    </div>
</div>
);
};

export default AuctioneerDashboard;