import mongoose, { Schema } from "mongoose";

const LiquorSchema = new Schema({
  liquor: {
    type: mongoose.Types.ObjectId,
    ref: "MasterLiquor",
  },
  stock: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: {type: Number, required: true}
    },
  ],
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
});

export const Liquor = mongoose.model("Liquor", LiquorSchema);
