import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
  {
    licensee: {
      type: String,
      required: true,
    },
    shop:{
      type: String,
      required: true,
    },
    firm:{
      type: String,
      required: true,
    },
    pan:{
      type:String,
      required: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    }
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);
