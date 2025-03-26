import mongoose, { Schema } from "mongoose";

const CLSchema = new Schema({
  stock: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
      pratifal: { type: Number, required: true },
      profit: { type: Number, required: true },
      wep: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
});

export const CL = mongoose.model("CL", CLSchema);
