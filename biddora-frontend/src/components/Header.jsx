import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaChevronDown,
  FaSignOutAlt,
  FaUsers,
  FaInfoCircle,
  FaUser,
  FaGavel, // Import Gavel for Auction
  FaRunning // Import Running icon for Players
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import FavoriteItem from "./FavoriteItem";

const Header = ({ userId, username, role, onLogout }) => {
  const [favoritesCount, setFavoritesCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login");
  const handlePlayersClick = () => navigate("/"); // Renamed handler
  const handleLiveAuctionClick = () => navigate("/live-auction"); // New handler
  const handleUsersClick = () => navigate("/user-view");
  const handleAboutClick = () => navigate("/about-us");
  const handleTeamsSummaryClick = () => navigate("/teams");
  const handleHomeClick = () => navigate("/");

  const fetchFavoritesCount = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/favorites/count/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const count = await response.json();
      setFavoritesCount(count);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching favorites count:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFavoritesCount();
    }
  }, [userId]);

  const refreshFavoritesCount = () => {
    fetchFavoritesCount();
  };

  return (
    <>
      <div className="w-full py-4 px-6 lg:px-20 bg-white flex items-center justify-between shadow-lg border-b border-gray-200 sticky top-0 z-50">
        {/* Logo/Home */}
        <div className="flex items-center justify-start">
          <button
            onClick={handleHomeClick}
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            IPL AUCTION 2026
          </button>
        </div>

        {/* Navigation and Search */}
        <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-8">
          <nav className="flex items-center space-x-8 mr-8">
            {/* Live Auction Link (New) */}
            <button
              onClick={handleLiveAuctionClick}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-200 group font-bold animate-pulse"
            >
              <FaGavel className="text-lg group-hover:rotate-12 transition-transform" />
              <span className="text-sm">LIVE AUCTION</span>
            </button>

            {/* Players Link (Renamed from Products) */}
            <button
              onClick={handlePlayersClick}
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 group"
            >
              <FaRunning className="text-sm group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Players</span>
            </button>

            {/* Teams Summary Link */}
            <button
              onClick={handleTeamsSummaryClick}
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 group"
            >
              <FaUsers className="text-sm group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Teams</span>
            </button>

            {role === "ADMIN" && (
              <button
                onClick={handleUsersClick}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 group"
              >
                <FaUsers className="text-sm group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Users</span>
              </button>
            )}

            {/*<button
              onClick={handleAboutClick}
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 group"
            >
              <FaInfoCircle className="text-sm group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">About Us</span>
            </button>*/}
          </nav>
        </div>

        {/* User Actions */}
        {username ? (
          <div className="flex items-center justify-end space-x-4">
           {/* {/* Favorites 
            <div className="relative">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 relative group"
              >
                <FaHeart className="w-5 h-5" />
                {favoritesCount > 0 && (
                  <>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {favoritesCount}
                    </div>
                  </>
                )}
              </button>

              {/* Favorites Popup 
              {showFavorites && (
                <div className="absolute right-0 mt-2 z-50">
                  <FavoriteItem
                    user={username}
                    setShowFavorites={setShowFavorites}
                    onFavoriteUpdate={refreshFavoritesCount}
                  />
                </div>
              )}
            </div>*/}

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <FaUser className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {username}
                  </span>
                  <FaChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User Menu Popup */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        navigate("/my-profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors duration-200"
                    >
                      <FaUser className="w-4 h-4" />
                      <span>My profile</span>
                    </button>

                    {role === "ADMIN" && (
                      <>
                        <button
                          onClick={() => {
                            navigate("/admin-panel");
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors duration-200"
                        >
                          <RiAdminFill className="w-4 h-4" />
                          <span>Admin panel</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                        navigate("/");
                      }}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors duration-200"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={handleLoginClick}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 flex justify-around items-center shadow-lg z-40">
        <button
          onClick={handleHomeClick}
          className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors"
        >
          <FaRunning className="w-5 h-5" />
          <span className="text-xs mt-1">Players</span>
        </button>

        <button
          onClick={handleLiveAuctionClick}
          className="flex flex-col items-center text-red-600 hover:text-red-700 transition-colors animate-pulse"
        >
          <FaGavel className="w-6 h-6" />
          <span className="text-xs mt-1 font-bold">AUCTION</span>
        </button>

        {username ? (
          <button
            onClick={() => navigate("/my-profile")}
            className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <FaUser className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        ) : (
          <button
            onClick={handleLoginClick}
            className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <FaUser className="w-5 h-5" />
            <span className="text-xs mt-1">Login</span>
          </button>
        )}
      </div>
    </>
  );
};

export default Header;