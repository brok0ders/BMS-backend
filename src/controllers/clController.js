import { CL } from "../models/clModel.js";

// get the CL by id
const getCL = async (req, res) => {
  try {
    const cl = await CL.find({ user: req?.user?._id });
    if (cl.length == 0) {
      return res.status(404).json({ success: false, message: "no CL found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "CL found successfully", cl });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the CL" });
  }
};

// create the new CL
const createCL = async (req, res) => {
  try {
    const stock = [
      {
        size: "750ml",
        price: 51.41,
        totalPrice: 66.06,
        pratifal: 1.38,
        profit: 4,
        wep: 3.0,
        quantity: 0,
      },
      {
        size: "375ml",
        price: 30.85,
        totalPrice: 41.88,
        pratifal: 3.77,
        profit: 2,
        wep: 1.5,
        quantity: 0,
      },
      {
        size: "180ml",
        price: 15.02,
        totalPrice: 18.64,
        pratifal: 0.04,
        profit: 1,
        wep: 0.75,
        quantity: 0,
      },
      {
        size: "200ml",
        price: 16.69,
        totalPrice: 21.29,
        pratifal: 0.77,
        profit: 1,
        wep: 0.8,
        quantity: 0,
      },
      {
        size: "200ml tetra",
        price: 13.52,
        totalPrice: 17.01,
        pratifal: 0.04,
        profit: 1,
        wep: 0.8,
        quantity: 0,
      },
    ];
    const brandName = "GULAB SPICED MALTA";

    const cl = await CL.create({
      brandName,
      stock,
      user: req?.body?.userId,
    });
    return res.status(201).json({
      success: true,
      message: "new CL created successfully!",
      cl,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create the CL" });
  }
};

// update the CL
const updateCL = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "atleast one field is required for updating the CL details",
      });
    }

    const cl = await CL.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!cl) {
      return res
        .status(404)
        .json({ success: false, message: "no such CL found" });
    }
    return res.status(200).json({
      success: true,
      message: "CL details updates successfully!",
      cl,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update the CL details" });
  }
};

export { getCL, createCL, updateCL };
