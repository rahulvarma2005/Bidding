import React from "react";
import { FaUser, FaEnvelope, FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserPreviewCard = ({ userId, firstName, lastName, email }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/user-profile/${userId}`);
  };

  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
  };

  const getGradient = (id) => {
    const gradients = [
      "from-purple-500 to-blue-500",
      "from-green-500 to-teal-500",
      "from-orange-500 to-red-500",
      "from-pink-500 to-rose-500",
      "from-indigo-500 to-purple-500"
    ];
    return gradients[id % gradients.length];
  };

  return (
    <div className="w-64 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      {/* Header with Gradient */}
      <div className={`bg-gradient-to-r ${getGradient(userId)} px-6 py-4`}>
        <div className="flex items-center justify-between">

        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className={`w-20 h-20 bg-gradient-to-r ${getGradient(userId)} rounded-2xl flex items-center justify-center shadow-lg border-4 border-white`}>
            <span className="text-white font-bold text-xl">
              {getInitials(firstName, lastName)}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {firstName} {lastName}
          </h2>
          <div className="flex items-center justify-center text-gray-600 mb-3">
            <FaEnvelope className="w-3 h-3 mr-2" />
            <span className="text-sm truncate">{email}</span>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <div className="text-center">
              <div className="font-semibold text-gray-900">24</div>
              <div>Products</div>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">89%</div>
              <div>Rating</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleButtonClick}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 group/btn"
        >
          <span>View Profile</span>
          <FaArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
        </button>

        {/* Additional Info */}
        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          <FaExternalLinkAlt className="w-3 h-3 mr-1" />
          <span>Click to explore</span>
        </div>
      </div>

    </div>
  );
};

export default UserPreviewCard;