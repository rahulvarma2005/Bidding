import React, { useEffect, useState } from "react";
import { FaTimes, FaHeart, FaTrash, FaShoppingBag, FaUser, FaExclamationTriangle } from "react-icons/fa";

const FavoriteItem = ({ setShowFavorites, onFavoriteUpdate }) => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const fetchUserFavorites = async () => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8081/api/favorites`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error while fetching favorites");
      }

      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId) => {
    setRemovingId(productId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8081/api/favorites/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error while removing from favorites");
      }
      
      setFavorites(prev => prev.filter(fav => fav.product.id !== productId));
      
      if (onFavoriteUpdate) {
        onFavoriteUpdate();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    fetchUserFavorites();
  }, []);

  return (
    <div className="w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FaHeart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">My Favorites</h2>
              <p className="text-white/80 text-sm">{favorites.length} items</p>
            </div>
          </div>
          <button
            onClick={() => setShowFavorites(false)}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200 group"
          >
            <FaTimes className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500">Loading favorites...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
            <FaExclamationTriangle className="w-12 h-12 text-red-400 mb-3" />
            <p className="text-red-500 text-sm mb-2">Error loading favorites</p>
            <button
              onClick={fetchUserFavorites}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : favorites.length > 0 ? (
          <div className="p-4 space-y-3">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="group bg-gray-50 hover:bg-purple-50 rounded-xl p-4 border border-gray-200 hover:border-purple-200 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <FaShoppingBag className="w-6 h-6 text-purple-500" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {fav.product.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <FaUser className="w-3 h-3 text-gray-400" />
                      <p className="text-sm text-gray-500 truncate">
                        {fav.user?.username || "Unknown user"}
                      </p>
                    </div>
                    {fav.product.price && (
                      <p className="text-sm font-semibold text-purple-600 mt-1">
                        ${fav.product.price}
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromFavorites(fav.product.id)}
                    disabled={removingId === fav.product.id}
                    className="flex-shrink-0 w-8 h-8 bg-white hover:bg-red-50 border border-red-200 text-red-500 hover:text-red-600 rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  >
                    {removingId === fav.product.id ? (
                      <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaTrash className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <FaHeart className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500 text-sm">
              Products you add to favorites will appear here
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {favorites.length > 0 && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{favorites.length} items</span>
            <button
              onClick={() => setShowFavorites(false)}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteItem;