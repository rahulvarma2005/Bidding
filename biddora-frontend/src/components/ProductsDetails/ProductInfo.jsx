import React from 'react';
import { FaClock, FaTag, FaDollarSign, FaCheckCircle, FaTimesCircle, FaCalendar } from 'react-icons/fa';

const ProductInfo = ({ bidStatus, startingPrice, closesIn }) => {
  const getStatusConfig = (status) => {
    const statusUpper = status?.toUpperCase();
    
    switch (statusUpper) {
      case 'OPEN':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <FaCheckCircle className="w-4 h-4" />,
          label: 'OPEN'
        };
      case 'CLOSED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <FaTimesCircle className="w-4 h-4" />,
          label: 'CLOSED'
        };
      case 'SCHEDULED':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <FaCalendar className="w-4 h-4" />,
          label: 'SCHEDULED'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <FaTag className="w-4 h-4" />,
          label: statusUpper || 'UNKNOWN'
        };
    }
  };

  const statusConfig = getStatusConfig(bidStatus);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 my-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
          <FaTag className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
            Auction Info
          </h2>
          <p className="text-gray-500 text-sm">Product details & bidding status</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="space-y-4">
        {/* Bid Status Card */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-300">
              {statusConfig.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Bid Status</p>
              <p className="text-gray-900 font-semibold">{statusConfig.label}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Closing Time Card */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:from-orange-100 hover:to-amber-100 transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-orange-300">
              <FaClock className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">
                {bidStatus?.toUpperCase() === 'SCHEDULED' ? 'Starts In' : 
                 bidStatus?.toUpperCase() === 'OPEN' ? 'Closes In' : 'Closed'}
              </p>
              <p className="text-gray-900 font-semibold">{closesIn || 'N/A'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Starting Price Card */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:from-purple-100 hover:to-blue-100 transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-purple-300">
              <FaDollarSign className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Starting Price</p>
              <p className="text-2xl font-bold text-gray-900">
                {startingPrice ? `$${formatPrice(startingPrice)}` : 'N/A'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
              Minimum bid
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default ProductInfo;