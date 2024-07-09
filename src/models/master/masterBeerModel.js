import mongoose, { Schema } from "mongoose";

const BeerSchema = new Schema({
  brandName: { type: String, required: true },

  company: {
    type: mongoose.Types.ObjectId,
    ref: "MasterCompany",
    require: true,
  },
  sizes: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true },
      wep: { type: Number, required: true }, //Women Empowerment Cow Protection Sports Activity Cess
      hologram: { type: Number, required: true }, //Hologram & track and trace fee
      pratifal: { type: Number, required: true }, //pratifal Fee
    },
  ],
});

export const MasterBeer = mongoose.model("MasterBeer", BeerSchema);
