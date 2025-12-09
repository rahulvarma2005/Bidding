import React, { useEffect, useState } from "react";
import { FaBox, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { API_BASE_URL } from "../config/api";
import ProductSmallCard from "./ProductSmallCard";
import { useNavigate } from "react-router-dom";

const UserOtherListings = ({ userId }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);

  const fetchUserProducts = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/products/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setError("Error while fetching user products");
        return;
      }

      const data = await response.json();
      setProducts(data);
      console.log(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProducts();
    }
  }, [userId]);

  const scroll = (direction) => {
    const container = document.getElementById("products-scroll");
    const scrollAmount = 300;
    const newPosition =
      direction === "left"
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount;

    setScrollPosition(newPosition);
    container.scrollTo({ left: newPosition, behavior: "smooth" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
            <FaBox className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
            Other Listings
          </h2>
        </div>

        {/* Navigation Arrows */}
        {products.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Products Scroll */}
      <div className="relative">
        <div
          id="products-scroll"
          className="flex space-x-2 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-64">
                <ProductSmallCard product={product} />
              </div>
            ))
          ) : (
            <div className="text-center w-full py-8 text-gray-500">
              <FaBox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>This user has no other products listed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOtherListings;
