import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://url***"
    )
    .then(() => console.log("DB Connected"));
};
