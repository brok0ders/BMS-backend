import mongoose, { Schema } from "mongoose";

const LiquorSchema = new Schema({
  brandName: { type: String, required: true },

  company: {
    type: mongoose.Types.ObjectId,
    ref: "MasterCompany",
    require: true,
  },
  sizes: [
    {
      size: { type: Number, required: true },
      price: { type: Number, required: true },
      wep: { type: Number, required: true }, //Women Empowerment Cow Protection Sports Activity Cess
      hologram: { type: Number, required: true }, //Hologram & track and trace fee
      pratifal: { type: Number, required: true }, //pratifal Fee
    },
  ],
});

export const MasterLiquor = mongoose.model("MasterLiquor", LiquorSchema);
