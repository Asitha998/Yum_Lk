import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://aadorg:AADORG1234@cluster0.9eabafx.mongodb.net/food-del"
    )
    .then(() => console.log("DB Connected"));
};
