import React from 'react';
import { FaAward, FaUsers, FaGavel, FaRocket, FaClock, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/")
  };

const features = [
    {
      icon: <FaGavel className="w-8 h-8" />,
      title: "Live Bidding",
      description: "Real-time auction experience with instant bid updates and competitive pricing."
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Community Driven",
      description: "Join thousands of passionate bidders in discovering unique items and great deals."
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      title: "Quality Guarantee",
      description: "Every product is verified to ensure authenticity and quality standards."
    },
    {
      icon: <FaClock className="w-8 h-8" />,
      title: "Time-Sensitive Deals",
      description: "Exciting auctions with countdown timers creating urgency and best prices."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Successful Bids" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FaGavel className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Biddora</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your premier destination for exclusive auctions and unique finds. 
            Discover, bid, and win with confidence in our trusted bidding community.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1"
            >
              <div className="text-purple-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded with a passion for creating fair and exciting auction experiences, 
                  Biddora brings the thrill of live bidding to your fingertips. We believe 
                  everyone should have access to unique items and great deals.
                </p>
                <p>
                  Our platform combines cutting-edge technology with a user-friendly interface, 
                  making bidding accessible to both seasoned collectors and first-time bidders.
                </p>
                <p>
                  We're committed to transparency, security, and creating a community where 
                  every bid counts and every win feels special.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
                <FaHeart className="w-16 h-16 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-8 mb-16 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-purple-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <FaRocket className="w-12 h-12 text-purple-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            To revolutionize the online auction experience by providing a secure, transparent, 
            and engaging platform where everyone can discover amazing items and win great deals 
            through fair and competitive bidding.
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-1 bg-purple-500 rounded-full"></div>
            <div className="w-8 h-1 bg-purple-500 rounded-full"></div>
            <div className="w-3 h-1 bg-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Bidding?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of satisfied bidders and discover your next great deal today.
            </p>
            <button onClick={handleButtonClick} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
              Start Bidding Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;