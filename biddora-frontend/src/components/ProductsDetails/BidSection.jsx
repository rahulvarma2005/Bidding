import React, { useEffect, useState, useRef } from "react";
import {
  FaGavel,
  FaHistory,
  FaUser,
  FaDollarSign,
  FaPaperPlane,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";
import { API_BASE_URL, WS_BASE_URL } from "../../config/api";
import { data } from "react-router-dom";

const BidSection = ({ productId, productStatus }) => {
  const socketRef = useRef(null);
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalBids, setTotalBids] = useState(0);

  const fetchBids = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");

      if (!productId) {
        setError("Product ID not found.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/bid/product/${productId}?page=0&size=3`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error while fetching bids");
      }

      const data = await response.json();

      setBids(data.content || []);
      setTotalBids(data.totalElements || 0);

      console.log("Fetched bids:", data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchBids();
    }
  }, [productId]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        console.log("Closing WebSocket connection on unmount");
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!bidAmount) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
          amount: bidAmount,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.log(data);
        throw new Error(`Greška prilikom slanja bida: ${response.status}`);
      }

      console.log(response);
      console.log(`✅ Uspješno bidovano na proizvod: ${productId}`);

      setBidAmount("");
    } catch (error) {
      console.log(data);
      console.error("Greška prilikom slanja bida:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWebSocketConnection = () => {
    if (socketRef.current) return;

    const ws = new WebSocket(WS_BASE_URL);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      ws.send(JSON.stringify({ productId }));
    };

    ws.onmessage = (event) => {
      if (!event.data) return;

      try {
        const newBid = JSON.parse(event.data);
        console.log("Received new bid:", newBid);

        setBids((prevBids) => {
          const updated = [newBid, ...prevBids];
          return updated.sort((a, b) => b.amount - a.amount);
        });
      } catch (error) {
        console.error("Greška parsiranja WS poruke:", event.data, error);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    socketRef.current = ws;
  };

  const formatCurrency = (amount) => {
    if (amount == null) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (error) {
    return (
      <div className="text-center text-red-500 py-6">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bids Table Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FaGavel className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Bidding History</h2>
              <p className="text-white/80 text-sm">
                {totalBids} total bids ({bids.length} shown)
              </p>
            </div>
          </div>
        </div>

        {/* Bids List */}
        <div className="p-6">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-lg mb-3 border border-gray-200">
            <div className="col-span-4 flex items-center space-x-3">
              <FaDollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">Bid</span>
            </div>
            <div className="col-span-4 flex items-center space-x-3">
              <FaCalendarAlt className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">Date</span>
            </div>
            <div className="col-span-3 flex items-center space-x-3">
              <FaUser className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">User</span>
            </div>
          </div>

          {/* Bids */}
          <div className="space-y-3">
            {bids.slice(0, 3).map((bid, index) => (
              <div
                key={bid.id}
                className={`grid grid-cols-12 gap-4 items-center p-4 rounded-xl border transition-all duration-200 ${
                  index === 0
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 ring-2 ring-green-200 shadow-sm"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {/* Bid Amount Column */}
                <div className="col-span-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        index === 0
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                          : "bg-white text-gray-600 border border-gray-300"
                      }`}
                    >
                      <FaDollarSign
                        className={`w-5 h-5 ${
                          index === 0 ? "text-white" : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`text-lg font-bold ${
                          index === 0 ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {formatCurrency(bid.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date Column */}
                <div className="col-span-4">
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {new Date(bid.date).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* User Column */}
                <div className="col-span-3">
                  <div className="flex items-center text-gray-600">
                    <FaUser className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {bid?.bidderUsername || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Bids State, status == OPEN*/}
          {bids.length === 0 && productStatus == "OPEN" && (
            <div className="text-center py-8">
              <FaGavel className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No bids yet. Be the first to bid!</p>
            </div>
          )}

          {bids.length === 0 && productStatus == "CLOSED" && (
            <div className="text-center py-8">
              <FaGavel className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">This auction is closed!</p>
            </div>
          )}
        </div>
      </div>

      {/* Place Bid Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <form onSubmit={handlePlaceBid} className="space-y-4">
          <div className="flex items-center space-x-4">
            {/* Bid Input */}
            <div className="flex-1 relative">
              <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                onClick={handleWebSocketConnection}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Enter your bid amount"
                min={bids[0]?.amount + 1 || 1}
                required
              />
            </div>

            {/* Place Bid Button */}
            <button
              type="submit"
              disabled={isSubmitting || !bidAmount}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none disabled:cursor-not-allowed min-w-32 justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Placing...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane className="w-4 h-4" />
                  <span>Place Bid</span>
                </>
              )}
            </button>
          </div>

          {/* Bid Information */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FaTrophy className="w-3 h-3 text-green-500 mr-1" />
                <span>
                  Current bid:{" "}
                  <strong>{formatCurrency(bids[0]?.amount || 0)}</strong>
                </span>
              </div>
              <div className="flex items-center">
                <FaGavel className="w-3 h-3 text-purple-500 mr-1" />
                <span>
                  Minimum bid:{" "}
                  <strong>{formatCurrency((bids[0]?.amount || 0) + 1)}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center text-gray-500">
              <FaHistory className="w-3 h-3 mr-1" />
              <span>{totalBids} bids total</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidSection;
