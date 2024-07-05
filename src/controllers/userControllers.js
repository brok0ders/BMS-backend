import { User } from "../models/userModel.js";

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

// create the new user [Register]
const createUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(404).json({
        success: false,
        message: "input data is insufficient for creating the user",
      });
    }

    const existingUser = await User.findOne({
      username: username,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "user already exists", existingUser });
    }
    const user = await User.create(req.body);
    const token = await user.generateAccessToken();
    return res
      .status(201)
      .json({ success: true, message: "new user created successfully!", user, token: token });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create the user", error: e });
  }
};

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
      return res
      .status(404)
      .json({ success: false, message: "no user found with the given email."});
    }
    const isCorrect = await existingUser.isPasswordCorrect(password);
    if (!isCorrect) {
      return res
      .status(401)
      .json({ success: false, message: "wrong password", existingUser});

    }
    const token = await existingUser.generateAccessToken();
    return res
    .status(201)
    .json({ success: true, message: "user logined successfully!", user: existingUser, token: token});
    
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
    const { name, email, username, password } = req.body;
    if (!name && !username && !password && !email) {
      return res.status(404).json({
        success: false,
        message: "at least one field is required for updating the user details",
      });
    }
    const user = await User.findByIdAndUpdate(
      req?.user?._id,
      { $set: req.body },
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
    const existingUser = await User.findById(req?.user?._id).select("-password");
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

export { getUser, getallUsers, createUser, updateUser, deleteUser, loginUser };
