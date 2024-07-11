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
        sizes: [
          {
            size: {
              type: String,
              require: true,
            },
            quantity: { type: Number, require: true },
            price: {
              type: Number,
              require: true,
            },
          },
        ],
      },
    ],
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
    },
    excise: {
      type: String,
      require: true,
    },
    pno: {
      type: String,
      require: true,
    },
    total: {
      type: Number,
      require: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Bill = mongoose.model("Bill", billSchema);
