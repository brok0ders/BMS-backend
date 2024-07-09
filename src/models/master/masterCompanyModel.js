import mongoose, { Schema } from "mongoose";
const SupplierSchema = new Schema({
  name: { type: String, required: true },
  companyType: { type: String, required: true },
});

export const MasterCompany = mongoose.model("MasterCompany", SupplierSchema);
