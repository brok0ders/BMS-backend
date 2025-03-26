import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: [{
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      require: true,
    }],
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    mobile: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    addressGodown: {
      type: String,
      require: true,
    },
    gType:{
      type: String,
      enum: ["fl","cl"],
      require: true,
      default:"fl",
    },
    FLliscensee: {
      type: String,
      rquire: true,
    },
    address: {
      type: String,
      require: true,
    },
    TINno: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    PANno: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    }
  },
  { timestamps: true }
);

// Pre hooks for password Hashing

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check the Password

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// AccessTOken

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};

export const User = mongoose.model("User", userSchema);

