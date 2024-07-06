import { Liquor } from "../models/liquorModel.js";

// get the Liquor by id
const getLiquor = async (req, res) => {
  try {
    const { id } = req.params;
    const liquor = await Liquor.findById(id);
    if (!liquor) {
      return res
        .status(404)
        .json({ success: false, message: "no Liquor found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Liquor found successfully", liquor });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the Liquor" });
  }
};

// get the Liquor by company name
const getLiqcom = async (req, res) => {
  try {
    const { com } = req.params;
    const liquor = await Liquor.find({company: com});
    if (!liquor || liquor.length==0) {
      return res
        .status(404)
        .json({ success: false, message: "no Liquor found on the given company name"});
    }
    return res
      .status(200)
      .json({ success: true, message: "Liquor found successfully of the given company", liquor });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the Liquor by company name" });
  }
};

// get all Liquors
const getallLiquors = async (req, res) => {
  try {
    const liquors = await Liquor.find();
    if (!liquors || liquors.length==0) {
      return res
        .status(404)
        .json({ success: false, message: "no Liquors found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Liquors found sucessfully", liquors });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get all the Liquors" });
  }
};

// create the new Liquor
const createLiquor = async (req, res) => {
  try {
    const { brandName, stock, price, company } = req.body;
    if (!brandName || !stock || !price || !company) {
      return res.status(404).json({
        success: false,
        message: "input data is insufficient for creating the Liquor",
      });
    }

    const existingLiquor = await Liquor.findOne({brandName});
    if (existingLiquor) {
      return res
        .status(400)
        .json({ success: false, message: "Liquor already exists" });
    }
    const liquor = await Liquor.create(req.body);
    return res
      .status(201)
      .json({
        success: true,
        message: "new Liquor created successfully!",
        liquor,
      });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create the Liquor" });
  }
};

// update the Liquor
const updateLiquor = async (req, res) => {
  try {
    const {id} = req.params;
    const { brandName, stock, price, company } = req.body;
    if (!brandName && !stock && !price && !company) {
      return res.status(404).json({
        success: false,
        message: "atleast one field is required for updating the Liquor details",
      });
    }

    const liquor = await Liquor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!Liquor) {
      return res
        .status(404)
        .json({ success: false, message: "no such Liquor found" });
    }
    return res.status(200).json({
      success: true,
      message: "Liquor details updates successfully!",
      liquor,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update the Liquor details" });
  }
};

// delete the Liquor
const deleteLiquor = async (req, res) => {
  try {
    const {id} = req.params;
    const existingLiquor = await Liquor.findById(id);
    if (!existingLiquor) {
      return res
        .status(404)
        .json({ success: false, message: "no Liquor found!" });
    }
    const liquor = await Liquor.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Liquor deleted successfully!", liquor });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete the Liquor." });
  }
};

export { getLiquor, getallLiquors, getLiqcom, createLiquor, updateLiquor, deleteLiquor };
