import { Bill } from "../models/billModel.js";
import { Company } from "../models/companyModel.js";
import { Customer } from "../models/customerModel.js";
import { Beer } from "../models/beerModel.js";
import { Liquor } from "../models/liquorModel.js";

// get the Bill by id
const getBill = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findById(id)
      .populate("seller")
      .populate("customer")
      .populate({
        path: "company",
        populate: { path: "company" },
      });
    if (!bill) {
      return res.status(404).json({ success: false, message: "no Bill found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Bill found successfully", bill });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get the Bill" });
  }
};

// get all Bills
const getallBills = async (req, res) => {
  try {
    const bills = await Bill.find({ seller: req?.user?._id })
      .populate("seller")
      .populate("customer")
      .populate({
        path: "company",
        populate: { path: "company" },
      });
    if (!bills || bills.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "no Bills found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Bills found sucessfully", bills });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get all the Bills" });
  }
};

// create the new Bill
const createBill = async (req, res) => {
  try {
    const { customer, seller, products, company } = req.body;
    if (!customer || !seller || !products || !company) {
      return res.status(404).json({
        success: false,
        message: "input data is insufficient for creating the Bill",
      });
    }
    let bill = await Bill.create(req.body);
    // bill = bill.populate("seller").populate("customer");
    return res.status(201).json({
      success: true,
      message: "new Bill created successfully!",
      bill,
    });
  } catch (e) {
    console.log(e);
    return res

      .status(500)
      .json({ success: false, message: "Failed to create the Bill" });
  }
};

// update the Bill
const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer, seller, products, company } = req.body;
    if (!customer && !seller && !products && !company) {
      return res.status(404).json({
        success: false,
        message: "atleast one field is required for updating the Bill details",
      });
    }

    const bill = await Bill.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    )
      .populate("seller")
      .populate("customer");

    if (!bill) {
      return res
        .status(404)
        .json({ success: false, message: "no such Bill found" });
    }
    return res.status(200).json({
      success: true,
      message: "Bill details updates successfully!",
      bill,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update the Bill details" });
  }
};

// delete the Bill
const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const existingBill = await Bill.findById(id);
    if (!existingBill) {
      return res
        .status(400)
        .json({ success: false, message: "no Bill found!" });
    }
    const bill = await Bill.findByIdAndDelete(id)
      .populate("seller")
      .populate("customer");
    return res
      .status(200)
      .json({ success: true, message: "Bill deleted successfully!", bill });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete the Bill." });
  }
};

const getBillRevenueChart = async (req, res) => {
  try {
    const revenueData = await Bill.aggregate([
      {
        $match: { seller: req?.user._id },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$total" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Map the aggregated data to the required format
    const data = revenueData.map((item) => ({
      month: new Date(item._id.year, item._id.month - 1, 1).toLocaleString(
        "default",
        { month: "short" }
      ),
      revenue: item.totalRevenue,
    }));

    // Return the data
    res.status(200).json({ message: "Data fetched", data });
  } catch (error) {
    console.error("Error fetching bill revenue chart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTopSellingBeers = async (req, res) => {
  try {
    const topSellingLiquors = await Bill.aggregate([
      {
        $match: {
          seller: req?.user?._id,
          billType: "beer",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $unwind: "$products.sizes",
      },
      {
        $group: {
          _id: "$products.brand",
          totalQuantity: { $sum: "$products.sizes.quantity" },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const data = topSellingLiquors.map((item) => ({
      brand: item._id,
      totalQuantity: item.totalQuantity,
    }));

    // Return the data
    res.status(200).json({ message: "Data Fetched", data });
  } catch (error) {
    console.error("Error fetching top selling liquors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getTopSellingLiquors = async (req, res) => {
  try {
    const topSellingLiquors = await Bill.aggregate([
      {
        $match: {
          seller: req?.user?._id,
          billType: "liquor",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $unwind: "$products.sizes",
      },
      {
        $group: {
          _id: "$products.brand",
          totalQuantity: { $sum: "$products.sizes.quantity" },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const data = topSellingLiquors.map((item) => ({
      brand: item._id,
      totalQuantity: item.totalQuantity,
    }));

    // Return the data
    res.status(200).json({ message: "Data Fetched", data });
  } catch (error) {
    console.error("Error fetching top selling liquors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Analytics data

const getAnalyticsData = async (req, res) => {
  try {
    const bill = await Bill.find({ seller: req?.user?._id });
    const totalRevenue = bill.reduce((acc, cur) => acc + cur.total, 0);
    const totalBills = bill.length;
    const totalCompanies = (await Company.find({ user: req?.user?._id }))
      .length;
    const customers = await Customer.find({ user: req?.user._id });
    const totalCustomers = customers.length;
    const totalBeers = (await Beer.find({ user: req?.user?._id })).length;
    const totalLiquors = (await Liquor.find({ user: req?.user?._id })).length;

    return res.status(200).json({
      message: "Analytics data fetched successfully",
      status: true,
      data: {
        totalRevenue: totalRevenue.toFixed(0),
        totalBills,
        totalCompanies,
        totalCustomers,
        totalBeers,
        totalLiquors,
      },
    });
  } catch (error) {
    console.error("Error fetching top selling liquors:", error);
    res.status(500).json({ error: "Failed to get analytics data" });
  }
};

export {
  getBill,
  getallBills,
  createBill,
  updateBill,
  deleteBill,
  getBillRevenueChart,
  getTopSellingBeers,
  getTopSellingLiquors,
  getAnalyticsData,
};
