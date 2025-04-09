// import mongoose, { Schema } from "mongoose";

// const CLSchema = new Schema({
//   stock: [
//     {
//       size: { type: String, required: true },
//       price: { type: Number, required: true },
//       totalPrice: { type: Number, required: true },
//       pratifal: { type: Number, required: true },
//       profit: { type: Number, required: true },
//       wep: { type: Number, required: true },
//       quantity: { type: Number, required: true },
//     },
//   ],
//   user: {
//     type: mongoose.Types.ObjectId,
//     ref: "User",
//     require: true,
//   },
// });

// export const CL = mongoose.model("CL", CLSchema);

import mongoose, { Schema } from "mongoose";

const CLSchema = new Schema(
  {
    brandName: {
      type: String,
      default: "GULAB SPICED MALTA",
    },
    companyName: {
      type: String,
      default: "MALTA",
    },
    stock: [
      {
        size: { type: String, required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        pratifal: { type: Number, required: true },
        profit: { type: Number, required: true },
        wep: { type: Number, required: true },
        quantity: { type: Number, default: 0 },
        leak: { type: Number, default: 0 },
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const CL = mongoose.model("CL", CLSchema);
