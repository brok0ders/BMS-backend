import mongoose, { Schema } from "mongoose";

const BeerSchema = new Schema({
  brandName: { type: String, required: true },
  taxes: {
    vat: { type: Number, required: true }, //Commercial tax
    cess: { type: Number, required: true }, //Cess tax
    wep: { type: Number, required: true }, //Women Empowerment Cow Protection Sports Activity Cess
    hologram: { type: Number, required: true }, //Hologram & track and trace fee
    flProfit: { type: Number, required: true }, //Profit of FL-2 Licens e Holder (Per Case)
    pratifal: { type: Number, required: true }, //pratifal Fee
    tcs: { type: Number, required: true, default: 1 },
  },
  company: {
    type: mongoose.Types.ObjectId,
    ref: "MasterCompany",
    require: true,
  },
  sizes: [
    {
      size: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
}); 

export const MasterBeer = mongoose.model("MasterBeer", BeerSchema);
