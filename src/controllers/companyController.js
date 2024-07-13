import { Company } from "../models/companyModel.js";

//create company
export const createCompany = async (req, res) => {
  try {
    const { company } = req.body;
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "input data is insufficient for creating the company",
      });
    }
    const existingCompany = await Company.findOne({
      company,
      user: req?.user?._id,
    });
    if (existingCompany) {
      return res
        .status(400)
        .json({ success: false, message: "Company already exist" });
    }
    let comp = await Company.create({
      company,
      user: req?.user?._id,
    });
    comp = await comp.populate("company");
    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      company: comp,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create company" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, companyType } = req.body;
    if (!name && !companyType) {
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
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Company details updated successfully",
      company: updateCompany,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the comapany" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient data" });
    }

    const company = await Company.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Company name deleted successfully",
      company: company,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the comapany" });
  }
};

// get the company by id
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id).populate("company");
    if (!company) {
      console.log("No comp found!!!");
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
export const getAllCompany = async (req, res) => {
  try {
    const { keyword } = req.query;
    let company;

    console.log(`Search keyword: ${keyword}`);

    if (keyword) {
      company = await Company.aggregate([
        {
          $lookup: {
            from: "mastercompanies",
            localField: "company",
            foreignField: "_id",
            as: "masterCompany",
          },
        },
        {
          $unwind: "$masterCompany",
        },
        {
          $match: {
            $or: [
              { "masterCompany.name": { $regex: keyword, $options: "i" } },
              {
                "masterCompany.companyType": { $regex: keyword, $options: "i" },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            "masterCompany.name": 1,
            "masterCompany.companyType": 1,
          },
        },
      ]);
    } else {
      company = await Company.find({ user: req.user?._id }).populate("company");
    }

    if (!company || company.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No company data found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company data fetched successfully",
      company,
    });
  } catch (e) {
    console.error("Error fetching company data:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch company data",
    });
  }
};
