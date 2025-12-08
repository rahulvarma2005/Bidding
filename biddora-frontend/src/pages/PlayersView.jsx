import React, { useEffect, useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import SidebarFilter from '../components/PlayersView/SidebarFilter';
import PlayerCard from '../components/PlayersView/PlayerCard';
import EditPlayerModal from '../components/PlayersView/EditPlayerModal';

const PlayersView = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false); // Mobile toggle
  const [activeFilters, setActiveFilters] = useState({
    role: [],
    nationality: [],
    status: []
  });
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Check if user is admin
  useEffect(() => {
    // First try to get role from stored user data
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === 'ADMIN') {
          setIsAdmin(true);
          return;
        }
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    }
    
    // Fallback: try to decode JWT token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check various possible role field names
        const role = payload.role || payload.roles || payload.authorities;
        const isAdminRole = role === 'ADMIN' || 
                           role === 'ROLE_ADMIN' || 
                           (Array.isArray(role) && (role.includes('ADMIN') || role.includes('ROLE_ADMIN')));
        setIsAdmin(isAdminRole);
      } catch (e) {
        setIsAdmin(false);
      }
    }
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      // Build Query Params
      const params = new URLSearchParams({ size: '100' }); // Fetch more for now
      if (search) params.append('name', search);

      const response = await fetch(`http://localhost:8081/api/players/all?${params}`);
      const data = await response.json();
      setPlayers(data.content || []);
    } catch (err) {
      console.error("Failed to fetch players", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle player edit
  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setShowEditModal(true);
  };

  // Handle player update (after save)
  const handlePlayerUpdated = (updatedPlayer) => {
    setPlayers(players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  };

  // Handle player delete
  const handleDeletePlayer = async (playerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/api/players/${playerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete player');
      }

      // Remove player from local state
      setPlayers(players.filter(p => p.id !== playerId));
    } catch (err) {
      console.error("Failed to delete player", err);
      alert("Failed to delete player. Please try again.");
    }
  };

  // Filter players client-side based on active filters
  const filteredPlayers = players.filter(player => {
    // Role filter: show if no roles selected OR player's role is in selected roles
    const roleMatch = activeFilters.role.length === 0 || activeFilters.role.includes(player.role);
    
    // Nationality filter: show if no nationality selected OR player's nationality matches
    const nationalityMatch = activeFilters.nationality.length === 0 || activeFilters.nationality.includes(player.nationality);
    
    // Status filter: show if no status selected OR player's status matches
    const statusMatch = activeFilters.status.length === 0 || activeFilters.status.includes(player.status);
    
    // Player must match ALL filter categories (AND logic between categories)
    return roleMatch && nationalityMatch && statusMatch;
  });

  useEffect(() => {
    fetchPlayers();
  }, [search]); // Refetch when search changes

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPlayers();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar (Desktop) */}
        <div className="hidden lg:block w-1/4">
          <div className="sticky top-24">
            <SidebarFilter onFiltersApply={setActiveFilters} />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden w-full mb-4 bg-white p-3 rounded-xl shadow flex items-center justify-center font-bold text-blue-600"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="mr-2" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          {showFilters && (
            <div className="lg:hidden mb-6">
              <SidebarFilter onFiltersApply={setActiveFilters} />
            </div>
          )}

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-8">
            <form onSubmit={handleSearch} className="relative">
              <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search players by name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </form>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500">Scouting players...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlayers.map(player => (
                <PlayerCard 
                  key={player.id} 
                  player={player} 
                  isAdmin={isAdmin}
                  onEdit={handleEditPlayer}
                  onDelete={handleDeletePlayer}
                />
              ))}
              {filteredPlayers.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No players found matching your criteria.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Player Modal */}
      <EditPlayerModal
        player={editingPlayer}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingPlayer(null);
        }}
        onSave={handlePlayerUpdated}
      />
    </div>
  );
};

export default PlayersView;