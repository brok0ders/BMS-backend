import mongoose, { Schema } from "mongoose";

const liquorSchema = new Schema(
  {
    brandName: {
      type: String,
      require: true,
    },
    stock: {
      Q: { type: Number, required: true },
      P: { type: Number, required: true },
      N: { type: Number, required: true },
    },
    price: {
      Q: { type: Number, required: true },
      P: { type: Number, required: true },
      N: { type: Number, required: true },
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      require: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    }
  },
  { timestamps: true }
);
export const Liquor = mongoose.model("Liquor", liquorSchema);
