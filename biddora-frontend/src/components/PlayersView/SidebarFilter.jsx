import React, { useState } from 'react';
import { FaFilter, FaRunning, FaGlobe, FaTags } from 'react-icons/fa';

const SidebarFilter = ({ onFiltersApply }) => {
  const [filters, setFilters] = useState({
    role: [],
    nationality: [],
    status: []
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const handleApply = () => onFiltersApply(filters);
  
  const handleReset = () => {
    const reset = { role: [], nationality: [], status: [] };
    setFilters(reset);
    onFiltersApply(reset);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 flex items-center space-x-3">
        <FaFilter className="text-white" />
        <h2 className="text-xl font-bold text-white">Filter Pool</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Role Filter */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <FaRunning className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Player Role</h3>
          </div>
          <div className="space-y-2">
            {['BATSMAN', 'BOWLER', 'ALL_ROUNDER', 'WICKET_KEEPER'].map(role => (
              <label key={role} className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.role.includes(role)}
                  onChange={() => handleFilterChange('role', role)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-600 capitalize">{role.replace('_', ' ').toLowerCase()}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Nationality Filter */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <FaGlobe className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Nationality</h3>
          </div>
          <div className="space-y-2">
            {['INDIAN', 'OVERSEAS'].map(nat => (
              <label key={nat} className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.nationality.includes(nat)}
                  onChange={() => handleFilterChange('nationality', nat)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-600 capitalize">{nat.toLowerCase()}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <FaTags className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Auction Status</h3>
          </div>
          <div className="space-y-2">
            {[
              { value: 'UPCOMING', label: 'Upcoming' },
              { value: 'SOLD', label: 'Sold' },
              { value: 'UNSOLD', label: 'Unsold' },
              { value: 'ON_AUCTION', label: 'Live Now' }
            ].map(status => (
              <label key={status.value} className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.status.includes(status.value)}
                  onChange={() => handleFilterChange('status', status.value)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-600">{status.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-3">
        <button onClick={handleApply} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Apply Filters
        </button>
        <button onClick={handleReset} className="w-full bg-white text-gray-700 py-2 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition">
          Reset
        </button>
      </div>
    </div>
  );
};

export default SidebarFilter;