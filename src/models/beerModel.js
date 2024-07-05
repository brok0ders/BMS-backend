import mongoose, { Schema } from "mongoose";

const beerSchema = new Schema(
  {
    brandName: {
      type: String,
      require: true,
    },
    stock: {
      650: { type: Number, required: true },
      500: { type: Number, required: true },
    },
    price: {
        650: { type: Number, required: true },
        500: { type: Number, required: true },
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      require: true,
    },
  },
  { timestamps: true }
);

export const Beer = mongoose.model("Beer", beerSchema);
