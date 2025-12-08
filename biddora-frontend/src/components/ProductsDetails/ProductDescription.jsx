import React from 'react';
import { FaAlignLeft, FaInfoCircle } from 'react-icons/fa';

const ProductDescription = ({ description }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
          <FaAlignLeft className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          Description
        </h2>
      </div> 

      <div className="flex items-start">
        <FaInfoCircle className="w-4 h-4 text-green-500 mt-1 mr-3 flex-shrink-0" />
        <p className="text-gray-600 leading-relaxed text-base">
          {description}
        </p>
      </div>

    </div>
  );
}

export default ProductDescription;