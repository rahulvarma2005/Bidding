import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEllipsisH,
  FaStar,
  FaPaperPlane,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { API_BASE_URL } from "../../config/api";

const CommentSection = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const fetchComments = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/ratings/product/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setError("Error while fetching comments");
        return;
      }

      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setComments([]);
    }
  };

  useEffect(() => {
    if (!productId) return;
    fetchComments();
  }, [productId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setError("Please enter a comment");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!productId) {
      setError("Product ID is missing");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: parseInt(productId),
          comment: newComment.trim(),
          ratingStars: rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit comment");
      }

      setNewComment("");
      setRating(0);

      await fetchComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const commentsArray = Array.isArray(comments) ? comments : [];

  const displayedComments = showAllComments
    ? commentsArray
    : commentsArray.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
          <FaUserCircle className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          Comments & Reviews
        </h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {commentsArray.length > 0 ? (
          <>
            {displayedComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {comment.user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {comment.user?.username || "Unknown user"}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-gray-500 text-sm">
                          <FaCalendarAlt className="w-3 h-3 mr-1" />
                          <span>{comment.date || "No date"}</span>
                        </div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`w-3 h-3 ${
                                star <= (comment.ratingStars || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{comment.comment}"</p>
              </div>
            ))}

            {/* View All Comments Button */}
            {commentsArray.length > 5 && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setShowAllComments(!showAllComments)}
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                >
                  <span>
                    {showAllComments
                      ? "Show less comments"
                      : `View all comments (${commentsArray.length})`}
                  </span>
                  {showAllComments ? (
                    <FaChevronUp className="w-3 h-3" />
                  ) : (
                    <FaChevronDown className="w-3 h-3" />
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaUserCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmitComment}
        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl focus:outline-none transition-transform hover:scale-110"
                disabled={isSubmitting}
              >
                <FaStar
                  className={`w-6 h-6 ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none disabled:opacity-50"
              placeholder="Share your thoughts about this product..."
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim() || rating === 0}
            className="self-end bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaPaperPlane className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
