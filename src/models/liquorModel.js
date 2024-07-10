import mongoose, { Schema } from "mongoose";

const LiquorSchema = new Schema({
  beer: {
    type: mongoose.Types.ObjectId,
    ref: "MasterLiquor",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
});

export const Liquor = mongoose.model("Liquor", LiquorSchema);
