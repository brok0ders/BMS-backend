import { MasterLiquor } from "../models/master/masterLiquorModel.js";

export const getAllMasterLiquors = async (req, res) => {
  try {
    const liquors = await MasterLiquor.find();
    if (liquors.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "No liquors found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Successfully fetched", liquors });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch liquor data" });
  }
};

export const insertManyLiquors = async (req, res) => {
  try {
    await MasterLiquor.insertMany(req.body);
    return res
      .status(200)
      .json({ success: true, message: "Successfully Created" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to insert liquor data" });
  }
};

export const getLiquorByBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    const decodedBrand = decodeURIComponent(brand);
    const liquors = await MasterLiquor.find({ brandName: brand });
    if (liquors.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No liquors found for the given brand",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Liquer fetched successfully",
      data: liquors,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the Liquor." });
  }
};
