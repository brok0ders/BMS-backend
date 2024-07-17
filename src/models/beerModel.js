import mongoose, { Schema } from "mongoose";

const BeerSchema = new Schema({
  beer: {
    type: mongoose.Types.ObjectId,
    ref: "MasterBeer",
  },
  stock: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      leak: {type: Number, default: 0},
    },
  ],
  company: {
    type: mongoose.Types.ObjectId,
    ref: "Company",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
});

export const Beer = mongoose.model("Beer", BeerSchema);
