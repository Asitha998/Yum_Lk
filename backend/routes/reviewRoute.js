import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addReview, getReviewsByFood, getAverageRatings } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// Add review (requires auth)
reviewRouter.post("/add", authMiddleware, addReview);

// Get reviews for a specific food item
reviewRouter.get("/food/:foodId", getReviewsByFood);

// Get average ratings for all foods
reviewRouter.get("/avg-ratings", getAverageRatings);

export default reviewRouter;