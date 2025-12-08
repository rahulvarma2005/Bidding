import React, { useState } from 'react';
import { FaExpand, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import foto from '../../assets/biciklo.jpeg';
import icon from '../../assets/react.svg';

const ProductGallery = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = [foto, icon, icon, icon, icon];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group bg-white rounded-2xl shadow-lg overflow-hidden">
        <img 
          src={images[selectedImage]} 
          alt="Main product" 
          className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>
        
        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <FaChevronRight className="w-4 h-4" />
        </button>

        {/* Zoom Icon */}
        <div className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300">
          <FaExpand className="w-4 h-4" />
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className='flex space-x-3 overflow-x-auto pb-2'>
        {images.map((image, index) => (
          <div 
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 cursor-pointer rounded-xl transition-all duration-300 ${
              selectedImage === index 
                ? 'ring-2 ring-purple-500 ring-offset-2' 
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <img 
              src={image} 
              alt={`Thumbnail ${index + 1}`} 
              className="h-20 w-20 object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;