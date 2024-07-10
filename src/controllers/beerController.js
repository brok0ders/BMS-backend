import { Beer } from "../models/beerModel.js";

//create Beer
export const createBeer = async (req, res) => {
  try {
    const { beerId, stock, company } = req.body;
    if (!beerId || !stock) {
      return res.status(404).json({
        success: false,
        message: "input data is insufficient for creating the Liquor",
      });
    }

    const existingBeer = await Beer.findOne({ beer: beerId });
    if (existingBeer) {
      return res
        .status(400)
        .json({ success: false, message: "Beer already exists" });
    }
    const beer = await Beer.create({
      beer: beerId,
      stock,
      company,
      user: req?.user?._id,
    });
    return res.status(201).json({
      success: true,
      message: "new Beer created successfully!",
      beer,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create the Beer" });
  }
};

export const updateBeer = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    if (!stock ) {
      return res.status(404).json({
        success: false,
        message: "input data is insufficient for updating the Beer",
      });
    }
    const updatedBeer = await Beer.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Beer details updated successfully",
      beer: updatedBeer,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the comapany" });
  }
};

export const deleteBeer = async (req, res) => {
  try {
    const { id } = req.params;
    const existingBeer = await Beer.findById(id);
    if (!existingBeer) {
      return res
        .status(404)
        .json({ success: false, message: "Beer not found" });
    }
    await Beer.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Beer deleted successfully",
      beer: existingBeer,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the comapany" });
  }
};

// get the Beer by id
export const getBeerById = async (req, res) => {
  try {
    const { id } = req.params;
    const beer = await Beer.findById(id);
    if (!beer) {
      return res
        .status(404)
        .json({ success: false, message: "Beer not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Beer found successfully", beer });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the Beer" });
  }
};

// get all Beer
export const getAllBeer = async (req, res) => {
  try {
    const beer = await Beer.find();
    if (!beer || beer.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "no Beer data found" });
    }
    return res.status(200).json({
      success: true,
      message: "Beer data fetched successfully",
      beer,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch Beer data" });
  }
};

//get beer by company
export const getBeerByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const beer = await Beer.find({ company: companyId });
    if (!beer) {
      return res
        .status(404)
        .json({ success: false, message: "Beer not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Beer found successfully", beer });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the Beer" });
  }
};
