import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./FoodDetails.css";
import { StoreContext } from "../../context/StoreContext";
import Rating from "@mui/material/Rating";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    food_list,
    fetchFoodList,
    url,
    addToCart,
    removeFromCart,
    cartItems,
    token,
    fetchAvgRatings,
  } = useContext(StoreContext);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const food = useMemo(
    () => food_list.find((item) => item._id === id),
    [food_list, id]
  );

  useEffect(() => {
    if (!food) {
      fetchFoodList();
    }
  }, [food, fetchFoodList]);

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await fetch(`${url}/api/review/food/${id}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = () => {
    addToCart(id);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!token) {
      setError("Please sign in to add a review.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${url}/api/review/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ foodId: id, rating, comment }),
      });
      const data = await res.json();
      if (data.success) {
        setComment("");
        setRating(4);
        setInfo("Review added");
        loadReviews();
        // Refresh averages so home/list cards reflect the new rating
        fetchAvgRatings();
      } else {
        setError(data.message || "Failed to add review");
      }
    } catch (err) {
      console.log(err);
      setError("Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!food) {
    return (
      <div className="food-details">
        <p className="muted">Loading item...</p>
      </div>
    );
  }

  return (
    <div className="food-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="food-hero">
        <img src={`${url}/images/${food.image}`} alt={food.name} />
        <div className="food-hero-info">
          <h2>{food.name}</h2>
          <p className="food-category">{food.category}</p>
          <p className="food-desc">{food.description}</p>
          <div className="food-price">${food.price}</div>
          <div className="food-actions">
            {!cartItems[food._id] ? (
              <button onClick={handleAddToCart} className="primary">
                Add to cart
              </button>
            ) : (
              <div className="qty-controls">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => removeFromCart(food._id)}
                >
                  –
                </button>
                <span className="qty-value">{cartItems[food._id]}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => addToCart(food._id)}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <header className="reviews-header">
          <div>
            <p className="eyebrow">Reviews</p>
            <h3>What people say</h3>
          </div>
        </header>

        <div className="reviews-list">
          {loadingReviews ? (
            <p className="muted">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="muted">No reviews yet. Be the first!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="review-card">
                <div className="review-top">
                  <div className="review-author">{rev.userId?.name || "User"}</div>
                  <Rating value={rev.rating} precision={0.5} readOnly size="small" sx={{ color: "#4CAF50" }} />
                </div>
                <p className="review-comment">{rev.comment || "(No comment)"}</p>
                <p className="review-date">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

        <form className="review-form" onSubmit={handleSubmitReview}>
          <div className="form-row">
            <label>Rating</label>
            <Rating
              name="new-rating"
              value={rating}
              precision={0.5}
              onChange={(_, val) => setRating(val || 0)}
              sx={{ color: "#4CAF50" }}
            />
          </div>
          <div className="form-row">
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              placeholder="Share your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          {info && <p className="info-text">{info}</p>}
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? "Posting..." : "Post review"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default FoodDetails;