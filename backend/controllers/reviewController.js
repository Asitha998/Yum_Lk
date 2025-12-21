import reviewModel from "../models/reviewModel.js";
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";

// Add a new review for a food item
export const addReview = async (req, res) => {
  try {
    const { foodId, rating, comment } = req.body;
    const userId = req.body.userId;

    if (!foodId || !rating) {
      return res.json({ success: false, message: "foodId and rating are required" });
    }

    const foodExists = await foodModel.exists({ _id: foodId });
    if (!foodExists) {
      return res.json({ success: false, message: "Food item not found" });
    }

    const parsedRating = Number(rating);
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.json({ success: false, message: "Rating must be between 1 and 5" });
    }

    await reviewModel.create({
      foodId,
      userId,
      rating: parsedRating,
      comment: comment || "",
    });

    return res.json({ success: true, message: "Review added" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error adding review" });
  }
};

// Get reviews for a food item
export const getReviewsByFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    if (!foodId) {
      return res.json({ success: false, message: "foodId is required" });
    }

    const reviews = await reviewModel
      .find({ foodId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate({ path: "userId", select: "name" });

    return res.json({ success: true, data: reviews });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error fetching reviews" });
  }
};

// Get average ratings for all foods
export const getAverageRatings = async (req, res) => {
  try {
    const agg = await reviewModel.aggregate([
      {
        $group: {
          _id: "$foodId",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const data = agg.map((a) => ({
      foodId: a._id,
      avgRating: Math.round(a.avg * 10) / 10,
      count: a.count,
    }));

    return res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error fetching average ratings" });
  }
};