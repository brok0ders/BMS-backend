import mongoose, { Schema } from "mongoose";

const BeerSchema = new Schema({
  beer: {
    type: mongoose.Types.ObjectId,
    ref: "MasterBeer",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
});

export const Beer = mongoose.model("Beer", BeerSchema);
