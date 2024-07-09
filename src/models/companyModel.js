import mongoose, { Schema } from "mongoose";

const companySchema = new Schema(
  {
    company: {
      type: mongoose.Types.ObjectId,
      ref: "MasterCompany",
      require: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);
