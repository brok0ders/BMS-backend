import { Customer } from "../models/customerModel.js";

//create Customer
export const createCustomer = async (req, res) => {
  try {
    const { licensee, shop, firm, pan, email } = req.body;
    if (!licensee || !shop || !firm || !pan) {
      return res.status(400).json({
        success: false,
        message: "input data is insufficient for creating the Customer",
      });
    }
    const existingCustomer = await Customer.findOne({
      licensee: licensee,
    });
    if (existingCustomer) {
      return res.status(200).json({
        success: false,
        message: "Customer Exists",
        customer: existingCustomer,
      });
    }
    const customer = await Customer.create({
      licensee,
      shop,
      firm,
      pan,
      email,
      user: req.user,
    });
    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create Customer" });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { licensee, shop, firm } = req.body;
    if (!licensee || !shop || !firm) {
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
      { $set: { licensee, shop, firm } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Customer details updated successfully",
      customer: updateCustomer,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the comapany" });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient data" });
    }
    const customer = await Customer.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Customer licensee deleted successfully",
      customer,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the comapany" });
  }
};

// get the Customer by id
export const getCustomerById = async (req, res) => {
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

// get the Customer by liscensee
export const getCustomerByLicensee = async (req, res) => {
  try {
    const { licensee } = req.params;
    const customer = await Customer.find({licensee: licensee});
    if (!customer) {
      return res
      .status(200)
      .json({ success: false, message: "No Customer found" });
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
export const getAllCustomer = async (req, res) => {
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
