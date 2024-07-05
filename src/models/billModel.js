import mongoose, { Mongoose, Schema } from "mongoose";

const billSchema = new Schema(
  {
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
      require: true,
    },
    seller: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    products: [
      {
        brand: {
          type: mongoose.Types.ObjectId,
          require: true,
        },
        quantity: {
          type: mongoose.Types.ObjectId,
          require: true,
        },
      },
    ],
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export const Bill = mongoose.model("Bill", billSchema);