import { MasterLiquor } from "../models/master/masterLiquorModel.js";

export const rmEX0 = async (req, res) => {
  try {
    const liquors = await MasterLiquor.find();

    let deletedLiquors = 0;
    let updatedLiquors = 0;

    // console.log("no of liquors: ", liquors.length);

    for (const liquor of liquors) {
      const exciseZeroSizes = liquor.sizes.filter((size) => size.excise === 0);

      // console.log("liquor size : "+liquor.sizes.length + ", excise = 0: ", exciseZeroSizes.length);
      
      if (exciseZeroSizes.length === liquor.sizes.length) {
        // All sizes have excise = 0 → delete entire liquor
        await MasterLiquor.findByIdAndDelete(liquor._id);
        deletedLiquors++;
      } else if (exciseZeroSizes.length > 0) {
        // Remove only excise=0 sizes and save
        liquor.sizes = liquor.sizes.filter((size) => size.excise !== 0);
        await liquor.save();
        updatedLiquors++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Liquor cleanup complete. Deleted: ${deletedLiquors}, Updated: ${updatedLiquors}`,
    });
  } catch (e) {
    console.error("Liquor rmEX0 Error:", e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to clean liquor data" });
  }
};

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
        message: "No liquor found for the given brand",
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

export const getLiquorByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const liquors = await MasterLiquor.find({ company: companyId });
    if (liquors.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No liquors found for the given company",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Liquors fetched successfully",
      data: liquors,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the Liquor." });
  }
};
