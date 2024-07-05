import { Company } from "../models/companyModel.js";

//create company
const createCompany = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "input data is insufficient for creating the company",
      });
    }
    const existingCompany = await Company.find({
      name: name,
    });
    if (existingCompany) {
      return res
        .status(400)
        .json({ success: false, message: "Company already exist" });
    }
    const company = await Company.create({
      name: name,
    });
    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create company" });
  }
};

const updateCompany = async (req, res) => {
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
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { $set: { name } },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Company details updated successfully" });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the comapany" });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient data" });
    }
    const company=await Company.findByIdAndDelete(id)
    return res.status(200).json({success:true,message:"Company name deleted successfully"})
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the comapany" });
  }
};

// get the company by id
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Company found successfully", company });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the company" });
  }
};

// get all company
const getAllCompany = async (req, res) => {
  try {
    const company = await Company.find();
    if (!company || company.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "no company data found" });
    }
    return res.status(200).json({
      success: true,
      message: "Company data fetched successfully",
      company,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch company data" });
  }
};