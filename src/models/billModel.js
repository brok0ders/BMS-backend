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
          type: String,
          require: true,
        },
        quantity: {},
      },
    ],
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
    },
    total: {
      type: Number,
      require: true,
      default: 0,
    }
  },
  { timestamps: true }
);

export const Bill = mongoose.model("Bill", billSchema);
