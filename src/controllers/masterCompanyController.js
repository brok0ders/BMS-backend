import { MasterCompany } from "../models/master/masterCompanyModel.js";

export const getAllMasterCompanies = async (req, res) => {
  try {
    const companies = await MasterCompany.find().sort({ companyType: -1 });
    if (companies.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "No companies found" });
    }

    return res.status(200).json({ success: true, data: companies });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get all companies" });
  }
};

export const insertManyCompanies = async (req, res) => {
  try {
    await MasterCompany.insertMany(req.body);
    return res
      .status(201)
      .json({ success: true, message: "Companies successfully inserted" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get all companies" });
  }
};
