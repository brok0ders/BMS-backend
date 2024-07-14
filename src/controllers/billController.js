import { Bill } from "../models/billModel.js";
import { Company } from "../models/companyModel.js";
import { Customer } from "../models/customerModel.js";
import { Beer } from "../models/beerModel.js";
import { Liquor } from "../models/liquorModel.js";
import { MasterBeer } from "../models/master/masterBeerModel.js";
import { MasterLiquor } from "../models/master/masterLiquorModel.js";

import { sendMail } from "../utils/sendMail.js";

// get the Bill by id
const getBill = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findById(id)
      .populate("seller")
      .populate("customer")
      .populate({
        path: "company",
        select: "name",
        populate: {
          path: "company",
          select: "name",
        },
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
    console.log(req);
    const bills = await Bill.find({ seller: req?.user?._id })
      .populate("seller")
      .populate("customer")
      .populate({
        path: "company",
        select: "name",
        populate: {
          path: "company",
          select: "name",
        },
      });
    console.log(bills);
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
    const { customer, products, company, billType } = req.body;
    if (!customer || !products || !company || !billType) {
      return res.status(404).json({
        success: false,
        message: "input data is insufficient for creating the Bill",
      });
    }

    req.body.seller = req.user._id;

    if (billType === "beer") {
      for (let i = 0; i < products?.length; i++) {
        const beerGlobal = await MasterBeer.findOne({
          brandName: products[i].brand,
        });
        if (!beerGlobal) {
          console.log(`No MasterBeer found for brand ${products[i].brand}`);
          continue;
        }

        const beer = await Beer.findOne({ beer: beerGlobal._id });
        if (!beer) {
          console.log(`No Beer found for brand ID ${beerGlobal._id}`);
          continue;
        }

        const stock = beer.stock.map((item) => {
          const matchingSize = products[i].sizes.find(
            (sizeItem) => sizeItem.size === item.size
          );
          if (matchingSize) {
            return {
              size: item.size,
              price: item.price,
              quantity: item.quantity - matchingSize.quantity,
            };
          }
          return item;
        });

        const updatedBeer = await Beer.findByIdAndUpdate(
          beer._id,
          { $set: { stock } },
          { new: true }
        );
      }
    }

    if (billType === "liquor") {
      for (let i = 0; i < products?.length; i++) {
        const liquorGlobal = await MasterLiquor.findOne({
          brandName: products[i].brand,
        });
        if (!liquorGlobal) {
          console.log(`No MasterLiquor found for brand ${products[i].brand}`);
          continue;
        }

        const liquor = await Liquor.findOne({ liquor: liquorGlobal._id });
        if (!liquor) {
          console.log(`No Liquor found for brand ID ${liquorGlobal._id}`);
          continue;
        }

        const stock = liquor.stock.map((item) => {
          const matchingSize = products[i].sizes.find(
            (sizeItem) => sizeItem.size === item.size
          );
          if (matchingSize) {
            return {
              size: item.size,
              price: item.price,
              quantity: item.quantity - matchingSize.quantity,
            };
          }
          return item;
        });

        const updatedLiquor = await Liquor.findByIdAndUpdate(
          liquor._id,
          { $set: { stock } },
          { new: true }
        );

        console.log(updatedLiquor);
      }
    }

    let bill = await Bill.create(req.body);
    bill = await bill.populate("seller");
    await sendMail({
      emails: bill.seller.email,
      billNo: bill.billNo,
      total: bill.total,
      name: bill.seller.name,
      url: `http://localhost:5173/dashboard/bill/details/${bill._id}`,
      date: new Date(bill?.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    });
    return res.status(201).json({
      success: true,
      message: "new Bill created successfully!",
      bill: bill._id,
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

const getMonthlyData = async (req, res) => {
  try {
    let { month, billType } = req.query;
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    let financialYearStart, financialYearEnd;

    if (currentDate.getMonth() + 1 >= 4) {
      // If current month is April or later
      financialYearStart = new Date(`${currentYear}-04-01`);
      financialYearEnd = new Date(`${currentYear + 1}-03-31`);
    } else {
      // If current month is before April
      financialYearStart = new Date(`${currentYear - 1}-04-01`);
      financialYearEnd = new Date(`${currentYear}-03-31`);
    }

    let matchCondition = {
      billType,
      seller: req?.user._id,
      createdAt: {
        $gte: financialYearStart,
        $lt: financialYearEnd,
      },
    };

    if (month != 0) {
      month = parseInt(month, 10);
      const startOfMonth = new Date(
        financialYearStart.getFullYear(),
        month - 1,
        1
      );
      const endOfMonth = new Date(financialYearStart.getFullYear(), month, 1);
      matchCondition.createdAt = {
        $gte: startOfMonth,
        $lt: endOfMonth,
      };
    }
    const bills = await Bill.find(matchCondition).lean();

    let totalRevenue = 0;
    let totalPratifal = 0;
    let totalTcs = 0;
    let sizeQuantities = {};

    bills.forEach((bill) => {
      totalRevenue += bill.total || 0;
      totalPratifal += bill.pratifal || 0;
      totalTcs += bill.tcs || 0;

      bill.products.forEach((product) => {
        product.sizes.forEach((size) => {
          if (!sizeQuantities[size.size]) {
            sizeQuantities[size.size] = 0;
          }
          sizeQuantities[size.size] += size.quantity;
        });
      });
    });

    let responseData;

    if (month == 0) {
      responseData = {
        totalRevenue,
        totalPratifal,
        totalTcs,
        sizes: sizeQuantities,
      };
    } else {
      let formattedData = {};

      bills.forEach((bill) => {
        const billYear = new Date(bill.createdAt).getFullYear();
        const billMonth = new Date(bill.createdAt).getMonth() + 1;

        if (!formattedData[`${billYear}-${billMonth}`]) {
          formattedData[`${billYear}-${billMonth}`] = {
            year: billYear,
            month: billMonth,
            totalRevenue: 0,
            totalPratifal: 0,
            totalTcs: 0,
            sizes: {},
          };
        }

        formattedData[`${billYear}-${billMonth}`].totalRevenue +=
          bill.total || 0;
        formattedData[`${billYear}-${billMonth}`].totalPratifal +=
          bill.pratifal || 0;
        formattedData[`${billYear}-${billMonth}`].totalTcs += bill.tcs || 0;

        bill.products.forEach((product) => {
          product.sizes.forEach((size) => {
            if (!formattedData[`${billYear}-${billMonth}`].sizes[size.size]) {
              formattedData[`${billYear}-${billMonth}`].sizes[size.size] = 0;
            }
            formattedData[`${billYear}-${billMonth}`].sizes[size.size] +=
              size.quantity;
          });
        });
      });

      responseData = Object.values(formattedData);
    }

    return res.status(200).json({
      message: "Monthly data fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching monthly data:", error);
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
  getMonthlyData,
};
