import React, { useState } from 'react';
import { FaPlus, FaCalendar, FaTag, FaDollarSign, FaCheck, FaTimes, FaAlignLeft } from 'react-icons/fa';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startingPrice: '',
    startTime: '',
    endTime: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Convert datetime-local value to LocalDateTime format for backend
  const formatDateTimeForBackend = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    const date = new Date(dateTimeString);
    
    // Format as LocalDateTime without timezone (without Z at the end)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You are not logged in');
      }

      // Validate that endTime is after startTime
      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
        throw new Error('End time must be after start time');
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        startingPrice: Number(formData.startingPrice),
        startTime: formatDateTimeForBackend(formData.startTime),
        endTime: formatDateTimeForBackend(formData.endTime)
      };

      console.log('Sending data:', productData); // For debug

      const response = await fetch('http://localhost:8081/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error adding product');
      }

      // Reset form and show success message
      setFormData({
        name: '',
        description: '',
        startingPrice: '',
        startTime: '',
        endTime: ''
      });
      setShowSuccess(true);
      
      // Auto hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessMessage = () => {
    setShowSuccess(false);
  };

  const closeErrorMessage = () => {
    setError('');
  };

  // Get minimum datetime for end time (must be after start time)
  const getMinEndTime = () => {
    return formData.startTime || '';
  };

  // Get minimum datetime for start time (current time)
  const getMinStartTime = () => {
    return new Date().toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <FaCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Success!
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Product has been successfully added.
            </p>
            <button
              onClick={closeSuccessMessage}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Add New Product
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Fill in the information below to add a new product to the auction
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaTimes className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <button
              onClick={closeErrorMessage}
              className="text-red-500 hover:text-red-700 transition-colors duration-200 flex-shrink-0"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <FaTag className="w-4 h-4 mr-2 text-purple-500" />
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="Enter product name"
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <FaAlignLeft className="w-4 h-4 mr-2 text-blue-500" />
                Product Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                placeholder="Enter detailed product description..."
              />
            </div>

            {/* Starting Price */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <FaDollarSign className="w-4 h-4 mr-2 text-green-500" />
                Starting Price ($)
              </label>
              <input
                type="number"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="0.00"
              />
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Time */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <FaCalendar className="w-4 h-4 mr-2 text-blue-500" />
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  min={getMinStartTime()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <FaCalendar className="w-4 h-4 mr-2 text-orange-500" />
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  min={getMinEndTime()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <FaPlus className="w-5 h-5" />
                    <span>Add Product</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">i</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Tips for adding products:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Choose a realistic starting price</li>
                <li>• End time must be after start time</li>
                <li>• Be precise in product description</li>
                <li>• Provide clear and detailed product information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;