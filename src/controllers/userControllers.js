import { CL } from "../models/clModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";
// get the user by id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req?.user?._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "no user found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User found successfully", user });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the user" });
  }
};

// get all users
const getallUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: "no users found" });
    }
    return res
      .status(200)
      .json({ success: false, message: "Users found sucessfully", users });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get all the users" });
  }
};

// Initialize the CL Model

const createInitialCLEntry = async (userId, session) => {
  const fixedSizes = [
    {
      size: "750ml",
      price: 51.41,
      totalPrice: 66.06,
      pratifal: 1.38,
      profit: 4,
      wep: 3,
      quantity: 0,
      leak: 0,
    },
    {
      size: "375ml",
      price: 30.85,
      totalPrice: 41.88,
      pratifal: 3.77,
      profit: 2,
      wep: 1.5,
      quantity: 0,
      leak: 0,
    },
    {
      size: "180ml",
      price: 15.02,
      totalPrice: 18.64,
      pratifal: 0.04,
      profit: 1,
      wep: 0.75,
      quantity: 0,
      leak: 0,
    },
    {
      size: "200ml",
      price: 16.69,
      totalPrice: 21.29,
      pratifal: 0.77,
      profit: 1,
      wep: 0.8,
      quantity: 0,
      leak: 0,
    },
    {
      size: "200ml tetra",
      price: 13.52,
      totalPrice: 17.01,
      pratifal: 0.04,
      profit: 1,
      wep: 0.8,
      quantity: 0,
      leak: 0,
    },
  ];

  // Check if CL entry already exists for this user
  const existingCL = await CL.findOne({ user: userId }).session(session);
  if (existingCL) {
    return existingCL;
  }

  // Create new CL entry
  const newCL = new CL({
    user: userId,
    brandName: "GULAB SPICED MALTA",
    companyName: "MALTA",
    stock: fixedSizes,
  });

  await newCL.save({ session });
  return newCL;
};

// create the new user [Register]
const createUser = async (req, res) => {
  // Start a new mongoose session
  const session = await mongoose.startSession();

  try {
    // Start a transaction
    await session.startTransaction();

    const {
      name,
      username,
      email,
      mobile,
      password,
      addressGodown,
      FLliscensee,
      address,
      TINno,
      PANno,
      gType,
    } = req.body;

    // Validate input
    if (
      !name ||
      !username ||
      !password ||
      !email ||
      !mobile ||
      !addressGodown ||
      !FLliscensee ||
      !address ||
      !TINno ||
      !PANno ||
      !gType
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Input data is insufficient for creating the user",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username: username }).session(
      session
    );
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user with the session
    const user = await User.create(
      [
        {
          name,
          username,
          email: [email],
          mobile,
          password,
          addressGodown,
          FLliscensee,
          address,
          TINno,
          PANno,
          gType,
        },
      ],
      { session }
    );

    // If user is CL type, create initial CL entry
    let clEntry = null;
    if (user[0] && user[0].gType === "cl") {
      clEntry = await createInitialCLEntry(user[0]._id, session);
    }

    // Generate access token
    const token = await user[0].generateAccessToken();

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "New user created successfully!",
      user: user[0],
      token: `Bearer ${token}`,
    });
  } catch (e) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();

    console.error("Error in user creation:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to create the user",
      error: e.message,
    });
  }
};

// const createInitialCLEntry = async (userId) => {
//   const fixedSizes = [
//     {
//       size: "750ml",
//       price: 51.41,
//       totalPrice: 66.06,
//       pratifal: 1.38,
//       profit: 4,
//       wep: 3,
//       quantity: 0,
//       leak: 0,
//     },
//     {
//       size: "375ml",
//       price: 30.85,
//       totalPrice: 41.88,
//       pratifal: 3.77,
//       profit: 2,
//       wep: 1.5,
//       quantity: 0,
//       leak: 0,
//     },
//     {
//       size: "180ml",
//       price: 15.02,
//       totalPrice: 18.64,
//       pratifal: 0.04,
//       profit: 1,
//       wep: 0.75,
//       quantity: 0,
//       leak: 0,
//     },
//     {
//       size: "200ml",
//       price: 16.69,
//       totalPrice: 21.29,
//       pratifal: 0.77,
//       profit: 1,
//       wep: 0.8,
//       quantity: 0,
//       leak: 0,
//     },
//     {
//       size: "200ml tetra",
//       price: 13.52,
//       totalPrice: 17.01,
//       pratifal: 0.04,
//       profit: 1,
//       wep: 0.8,
//       quantity: 0,
//       leak: 0,
//     },
//   ];

//   try {
//     // Check if CL entry already exists for this user
//     const existingCL = await CL.findOne({ user: userId });
//     if (existingCL) {
//       return existingCL;
//     }

//     // Create new CL entry
//     const newCL = new CL({
//       user: userId,
//       brandName: "GULAB SPICED MALTA",
//       companyName: "MALTA",
//       stock: fixedSizes,
//     });

//     await newCL.save();
//     return newCL;
//   } catch (error) {
//     console.error("Error creating initial CL entry:", error);
//     throw error;
//   }
// };

// // create the new user [Register]
// const createUser = async (req, res) => {
//   try {
//     const {
//       name,
//       username,
//       email,
//       mobile,
//       password,
//       addressGodown,
//       FLliscensee,
//       address,
//       TINno,
//       PANno,
//       gType,
//     } = req.body;
//     if (
//       !name ||
//       !username ||
//       !password ||
//       !email ||
//       !mobile ||
//       !addressGodown ||
//       !FLliscensee ||
//       !address ||
//       !TINno ||
//       !PANno ||
//       !gType
//     ) {
//       return res.status(404).json({
//         success: false,
//         message: "input data is insufficient for creating the user",
//       });
//     }

//     const existingUser = await User.findOne({
//       username: username,
//     });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ success: false, message: "user already exists" });
//     }
//     const user = await User.create({
//       name,
//       username,
//       email: [email],
//       mobile,
//       password,
//       addressGodown,
//       FLliscensee,
//       address,
//       TINno,
//       PANno,
//       gType,
//     });

//     if (user && user.gType === "cl") {
//       await createInitialCLEntry(user._id);
//     }

//     const token = await user.generateAccessToken();

//     return res.status(201).json({
//       success: true,
//       message: "new user created successfully!",
//       user,
//       token: `Bearer ${token}`,
//     });
//   } catch (e) {
//     console.log(e);
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to create the user", error: e });
//   }
// };

// login the existing user [Login]
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(404).json({
        success: false,
        message: "input data is insufficient for creating the user",
      });
    }

    let existingUser = await User.findOne({
      username: username,
    });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "no user found with the given email.",
      });
    }
    const isCorrect = await existingUser.isPasswordCorrect(password);
    if (!isCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "wrong user/password", existingUser });
    }
    const token = await existingUser.generateAccessToken();
    return res.status(201).json({
      success: true,
      message: "user logined successfully!",
      user: existingUser,
      token: `Bearer ${token}`,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to login the user" });
  }
};

// update the user
const updateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password && !email) {
      return res.status(404).json({
        success: false,
        message: "at least one field is required for updating the user details",
      });
    }
    const user = await User.findByIdAndUpdate(
      req?.user?._id,
      {
        $set: {
          password: password,
        },
        $push: {
          email: email,
        },
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "no such user found" });
    }
    return res.status(200).json({
      success: true,
      message: "user details updates successfully!",
      user,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update the user details" });
  }
};

// update the user
const deleteEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "email is required for adding the email",
      });
    }
    const user = await User.findByIdAndUpdate(
      req?.user?._id,
      {
        $pull: { email: email },
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "no such user found" });
    }
    return res.status(200).json({
      success: true,
      message: "user details updates successfully!",
      user,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update the user details" });
  }
};

// delete the user
const deleteUser = async (req, res) => {
  try {
    const existingUser = await User.findById(req?.user?._id).select(
      "-password"
    );
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "no user found!" });
    }
    const user = await User.findByIdAndDelete(req?.user?._id);
    return res
      .status(200)
      .json({ success: true, message: "user deleted successfully!", user });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete the user." });
  }
};

export {
  getUser,
  getallUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  deleteEmail,
};
