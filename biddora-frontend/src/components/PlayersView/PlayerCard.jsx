import React from 'react';
import { FaGavel, FaTrophy } from 'react-icons/fa';
// Use a placeholder if image is missing
import defaultImg from '../../assets/biciklo.jpeg'; // You might want to rename this asset later

const PlayerCard = ({ player }) => {
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'SOLD': return <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">SOLD</span>;
      case 'UNSOLD': return <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">UNSOLD</span>;
      case 'ON_AUCTION': return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded animate-pulse">LIVE</span>;
      default: return <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded">UPCOMING</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={player.imageUrl || defaultImg} 
          alt={player.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          {getStatusBadge(player.status)}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{player.name}</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{player.role}</p>
          </div>
          <div className="text-right">
             <span className={`text-xs font-semibold px-2 py-0.5 rounded ${player.nationality === 'INDIAN' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
               {player.nationality}
             </span>
          </div>
        </div>

        {/* Stats Preview */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
          {player.stats || "No stats available"}
        </p>

        <div className="border-t border-gray-100 pt-3">
          {player.status === 'SOLD' ? (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Sold To</p>
                <p className="font-bold text-purple-600 flex items-center">
                  <FaTrophy className="mr-1" /> {player.soldToTeamName || "Unknown"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Price</p>
                <p className="font-bold text-green-600">₹{player.soldPrice?.toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Base Price</p>
                <p className="font-bold text-gray-900">₹{player.basePrice?.toLocaleString()}</p>
              </div>
              {player.status === 'ON_AUCTION' && (
                <button className="bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center animate-bounce">
                  <FaGavel className="mr-1" /> BID NOW
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;