import { User } from "../models/userModel";

// get the user by id
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
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
    const users = await User.find();
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
    const { name, email, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(404).json({
        success: false,
        message: "input data is insufficient for creating the user",
      });
    }

    const existingUser = await User.find({
      name: name,
      username: username,
      password: password,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "user already exists" });
    }
    const user = await User.create({ name, username, password });
    return res
      .status(201)
      .json({ success: true, message: "new user created successfully!", user });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create the user" });
  }
};

// create the new user [Register]
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(404).json({
        success: false,
        message: "input data is insufficient for creating the user",
      });
    }

    const existingUser = await User.find({
      username: username,
      password: password,
    });
    if (existingUser) {
        return res
        .status(201)
        .json({ success: true, message: "user logined successfully!", existingUser});
    }
    
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to login the user" });
  }
};

// update the user
const updateUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    if (!name && !username && !password) {
      return res.status(404).json({
        success: false,
        message: "at least one field is required for updating the user details",
      });
    }
    const user = await User.findByIdAndUpdate(
      req?.user?._id,
      { $set: req.body },
      { new: true }
    );

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
    const existingUser = await User.findById(req?.user?._id);
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
