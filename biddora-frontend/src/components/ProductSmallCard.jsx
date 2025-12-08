import React from "react";
import { FaClock, FaTag, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import foto from "../assets/biciklo.jpeg";

const ProductSmallCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product-details/${product.id}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "closed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className="w-64 bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 cursor-pointer transform hover:scale-[1.03] transition-all duration-300 overflow-hidden group"
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={foto}
          alt={product?.name || "Product image"}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* View details arrow */}
        <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <FaArrowRight className="w-3 h-3 text-purple-600" />
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4">
        {/* Title and Description */}
        <div className="mb-3">
          <h1 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors duration-200">
            {product?.name || "Product Name"}
          </h1>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product?.description || "No description available"}
          </p>
        </div>

        {/* Status and Price Row */}
        <div className="flex items-center justify-between mb-3">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              product?.productStatus
            )}`}
          >
            <FaTag className="w-3 h-3 mr-1" />
            {product?.productStatus || "Unknown"}
          </span>

          {/* Price */}
          <div className="text-right">
            <p className="text-xs text-gray-500">Starting price</p>
            <h2 className="text-xl font-bold text-purple-600">
              {formatPrice(product?.startingPrice)}
            </h2>
          </div>
        </div>

        {/* Date and Additional Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-gray-500 text-sm">
            <FaClock className="w-3 h-3 mr-1" />
            <span>{formatDate(product?.createdAt)}</span>
          </div>

          {/* View Details CTA */}
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center group-hover:underline transition-all duration-200">
            View Details
            <FaArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-200 rounded-2xl pointer-events-none transition-all duration-300" />
    </div>
  );
};

export default ProductSmallCard;
