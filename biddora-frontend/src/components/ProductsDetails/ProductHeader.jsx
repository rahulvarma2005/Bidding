import React from "react";
import { FaTag, FaInfoCircle } from "react-icons/fa";

const ProductHeader = ({ name, description }) => {
  return (
    <div className="w-full mb-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Title Section */}
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
          <FaTag className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          {name}
        </h1>
      </div>

      {/* Description Section */}
      <div className="flex items-start">
        <FaInfoCircle className="w-4 h-4 text-purple-500 mt-1 mr-3 flex-shrink-0" />
        <p className="text-gray-600 leading-relaxed text-base">
          {description || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, aliquam quaerat. Quas quidem dolore inventore laudantium unde porro praesentium suscipit quam."}
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default ProductHeader;