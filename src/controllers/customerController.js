import { Customer } from "../models/customerModel.js";

//create Customer
const createCustomer = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "input data is insufficient for creating the Customer",
      });
    }
    const existingCustomer = await Customer.find({
      name: name,
    });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ success: false, message: "Customer already exist" });
    }
    const customer = await Customer.create({
      name: name,
    });
    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create Customer" });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Insufficient data for updating the value",
      });
    }
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient data" });
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { $set: { name } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Customer details updated successfully",
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the comapany" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient data" });
    }
    const Customer = await Customer.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Customer name deleted successfully" });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the comapany" });
  }
};

// get the Customer by id
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Customer found successfully",
      customer,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the Customer" });
  }
};

// get all Customer
const getAllCustomer = async (req, res) => {
  try {
    const customer = await Customer.find();
    if (!customer || customer.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "no Customer data found" });
    }
    return res.status(200).json({
      success: true,
      message: "Customer data fetched successfully",
      customer,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch Customer data" });
  }
};