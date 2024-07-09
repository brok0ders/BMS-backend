import mongoose, { Schema } from "mongoose";

const companySchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    companyType: {
      type: String,
      enum: ["beer", "liquor"]
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    }
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);
