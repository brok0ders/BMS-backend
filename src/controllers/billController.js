import { Bill } from "../models/billModel.js";
import { Company } from "../models/companyModel.js";
import { Customer } from "../models/customerModel.js";
import { Beer } from "../models/beerModel.js";
import { Liquor } from "../models/liquorModel.js";
import { MasterBeer } from "../models/master/masterBeerModel.js";
import { MasterLiquor } from "../models/master/masterLiquorModel.js";

import { sendCustomerMail, sendMail } from "../utils/sendMail.js";
import { CL } from "../models/clModel.js";
import mongoose from "mongoose";

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
// const createBill = async (req, res) => {
//   try {
//     const { customer, products, company, billType } = req.body;
//     if (!customer || !products || !company || !billType) {
//       return res.status(404).json({
//         success: false,
//         message: "input data is insufficient for creating the Bill",
//       });
//     }

//     req.body.seller = req.user._id;

//     if (billType === "beer") {
//       for (let i = 0; i < products?.length; i++) {
//         const beerGlobal = await MasterBeer.findOne({
//           brandName: products[i].brand,
//         });
//         if (!beerGlobal) {
//           console.log(`No MasterBeer found for brand ${products[i].brand}`);
//           continue;
//         }

//         const beer = await Beer.findOne({ beer: beerGlobal._id });
//         if (!beer) {
//           console.log(`No Beer found for brand ID ${beerGlobal._id}`);
//           continue;
//         }

//         const stock = beer.stock.map((item) => {
//           const matchingSize = products[i].sizes.find(
//             (sizeItem) => sizeItem.size === item.size
//           );
//           if (matchingSize) {
//             return {
//               size: item.size,
//               price: item.price,
//               quantity: item.quantity - matchingSize.quantity,
//             };
//           }
//           return item;
//         });

//         const updatedBeer = await Beer.findByIdAndUpdate(
//           beer._id,
//           { $set: { stock } },
//           { new: true }
//         );
//       }
//     }

//     if (billType === "liquor") {
//       for (let i = 0; i < products?.length; i++) {
//         const liquorGlobal = await MasterLiquor.findOne({
//           brandName: products[i].brand,
//         });
//         if (!liquorGlobal) {
//           console.log(`No MasterLiquor found for brand ${products[i].brand}`);
//           continue;
//         }

//         const liquor = await Liquor.findOne({ liquor: liquorGlobal._id });
//         if (!liquor) {
//           console.log(`No Liquor found for brand ID ${liquorGlobal._id}`);
//           continue;
//         }

//         const stock = liquor.stock.map((item) => {
//           const matchingSize = products[i].sizes.find(
//             (sizeItem) => sizeItem.size === item.size
//           );
//           if (matchingSize) {
//             return {
//               size: item.size,
//               price: item.price,
//               quantity: item.quantity - matchingSize.quantity,
//             };
//           }
//           return item;
//         });

//         const updatedLiquor = await Liquor.findByIdAndUpdate(
//           liquor._id,
//           { $set: { stock } },
//           { new: true }
//         );

//         console.log(updatedLiquor);
//       }
//     }

//     let createdBill = await Bill.create(req.body);
//     const bill = await Bill.findById(createdBill._id)
//       .populate("seller")
//       .populate("customer");
//     const emailData = bill.seller.email;
//     await sendMail({
//       emails: emailData,
//       billNo: bill.billNo,
//       total: bill.total,
//       name: bill.seller.name,
//       url: `https://bottlers.netlify.app/dashboard/bill/details/${bill._id}`,
//       // url: `https://bottlers.netlify.app/dashboard/bill/details/${bill._id}`,
//       date: new Date(bill?.createdAt).toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       }),
//     });
//     await sendCustomerMail({
//       email: bill.customer.email,
//       billNo: bill.billNo,
//       total: bill.total,
//       name: bill.customer.licensee,
//       // url: `https://bottlers.netlify.app/dashboard/bill/details/${bill._id}`,
//       url: `https://bottlers.netlify.app/dashboard/bill/details/${bill._id}`,
//       date: new Date(bill?.createdAt).toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       }),
//     });
//     return res.status(201).json({
//       success: true,
//       message: "new Bill created successfully!",
//       bill: bill._id,
//     });
//   } catch (e) {
//     console.log(e);
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to create the Bill" });
//   }
// };

const createBill = async (req, res) => {
  try {
    const { customer, products, company, billType } = req.body;
    if (!customer || !products || !billType) {
      return res.status(404).json({
        success: false,
        message: "input data is insufficient for creating the Bill",
      });
    }

    req.body.seller = req.user._id;

    if (billType === "beer") {
      // Existing beer update logic
      for (let i = 0; i < products?.length; i++) {
        const beerGlobal = await MasterBeer.findOne({
          brandName: products[i].brand,
        });
        if (!beerGlobal) {
          console.log(`No MasterBeer found for brand ${products[i].brand}`);
          continue;
        }

        const beer = await Beer.findOne({
          beer: beerGlobal._id,
          user: req?.user?._id,
        });
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
              leak: item.leak,
            };
          }
          return item;
        });

        const b = await Beer.findByIdAndUpdate(
          beer._id,
          { $set: { stock } },
          { new: true }
        );
      }
    }

    if (billType === "liquor") {
      // Existing liquor update logic
      for (let i = 0; i < products?.length; i++) {
        const liquorGlobal = await MasterLiquor.findOne({
          brandName: products[i].brand,
        });
        if (!liquorGlobal) {
          // console.log(`No MasterLiquor found for brand ${products[i].brand}`);
          continue;
        }

        const liquor = await Liquor.findOne({
          liquor: liquorGlobal._id,
          user: req?.user?._id,
        });
        if (!liquor) {
          // console.log(`No Liquor found for brand ID ${liquorGlobal._id}`);
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
              leak: item.leak,
            };
          }
          return item;
        });

        const l = await Liquor.findByIdAndUpdate(
          liquor._id,
          { $set: { stock } },
          { new: true }
        );
        // console.log("updated liquor: ", l);
      }
    }

    if (billType === "cl") {
      try {
        const cl = await CL.findOne({ user: req.user._id });
        if (!cl) {
          // console.log(`No CL found for user ${req.user._id}`);
          return res.status(404).json({ message: "CL not found" });
        }

        // Create a deep copy of the stock and update the quantity
        let updatedStock = cl.stock.map((stockItem) => {
          // Find the matching product by brand name (assuming all belong to one brand)
          const matchingProduct = products.find((product) =>
            product.sizes.some((size) => size.size === stockItem.size)
          );

          if (matchingProduct) {
            // Find the correct size inside the product
            const matchingSize = matchingProduct.sizes.find(
              (size) => size.size === stockItem.size
            );

            if (matchingSize) {
              console.log(
                `Updating size: ${stockItem.size}, Current Quantity: ${stockItem.quantity}, Deducting: ${matchingSize.quantity}`
              );

              return {
                ...stockItem,
                quantity: stockItem.quantity - matchingSize.quantity, // Reduce the stock
              };
            }
          }

          return stockItem; // Return unchanged if no match found
        });

        // Validate stock to ensure no negative values
        const hasNegativeStock = updatedStock.some((item) => item.quantity < 0);
        if (hasNegativeStock) {
          return res.status(400).json({
            message: "Insufficient stock",
            currentStock: cl.stock,
            requestedStock: products,
          });
        }

        // Update the stock in the database
        cl.stock = updatedStock;
        await cl.save(); // Ensure the document is actually updated

        // console.log("Stock updated successfully:", cl.stock);
      } catch (error) {
        console.error("Error updating CL stock:", error);
        return res.status(500).json({
          message: "Error updating stock",
          error: error.message,
        });
      }
    }

    let createdBill = await Bill.create(req.body);
    if (req.body.createdAt) {
      createdBill.createdAt = new Date(req.body.createdAt);
      await createdBill.save();
    }
    const bill = await Bill.findById(createdBill._id)
      .populate("seller")
      .populate("customer");
    const emailData = bill.seller.email;
    await sendMail({
      emails: emailData,
      billNo: bill.billNo,
      total: bill.total,
      name: bill.seller.name,
      url:
        billType === "cl"
          ? `https://bottlers.netlify.app/dashboard/cl/bill/details/${bill._id}`
          : `https://bottlers.netlify.app/dashboard/bill/details/${bill._id}`,
      date: new Date(bill?.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    });

    await sendCustomerMail({
      email: bill.customer.email,
      billNo: bill.billNo,
      total: bill.total,
      name: bill.customer.licensee,
      url:
        billType === "cl"
          ? `https://bottlers.netlify.app/dashboard/cl/bill/details/${bill._id}`
          : `https://bottlers.netlify.app/dashboard/bill/details/${bill._id}`,
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
    const { paid } = req.body;
    if (!paid) {
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
      revenue: Number(item.totalRevenue), // Ensure revenue is a number
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
      totalQuantity: Number(item.totalQuantity), // Ensure quantity is a number
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
      totalQuantity: Number(item.totalQuantity), // Ensure quantity is a number
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
    const totalRevenue = bill.reduce((acc, cur) => acc + Number(cur.total), 0); // Ensure numbers for addition
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
        totalRevenue: Number(totalRevenue.toFixed(2)),
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
    let { fromDate, toDate, billType } = req.query;
    const currentDate = new Date();

    if (!fromDate || !toDate) {
      const currentYear = currentDate.getFullYear();
      let financialYearStart, financialYearEnd;

      if (currentDate.getMonth() + 1 >= 4) {
        financialYearStart = new Date(`${currentYear}-04-01`);
        financialYearEnd = new Date(`${currentYear + 1}-03-31`);
      } else {
        financialYearStart = new Date(`${currentYear - 1}-04-01`);
        financialYearEnd = new Date(`${currentYear}-03-31`);
      }

      fromDate = financialYearStart;
      toDate = financialYearEnd;
    } else {
      fromDate = new Date(fromDate);
      toDate = new Date(toDate);

      toDate.setHours(23, 59, 59, 999);
    }

    let matchCondition = {
      billType,
      seller: req.user?._id,
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    };

    const bills = await Bill.find(matchCondition).lean();

    let totalRevenue = 0;
    let totalPratifal = 0;
    let totalTcs = 0;
    let totalExcise = 0;
    let sizeQuantities = {};

    bills.forEach((bill) => {
      totalRevenue += Number(bill.total) || 0;
      totalPratifal += Number(bill.pratifal) || 0;
      totalExcise += Number(bill.fexcise) || 0;
      totalTcs += Number(bill.tcs) || 0;

      bill.products.forEach((product) => {
        product.sizes.forEach((size) => {
          if (!sizeQuantities[size.size]) {
            sizeQuantities[size.size] = 0;
          }
          sizeQuantities[size.size] += Number(size.quantity);
        });
      });
    });

    const isAggregateOnly = req.query.aggregate === "true";

    let responseData;

    if (isAggregateOnly) {
      responseData = {
        totalRevenue,
        totalPratifal,
        totalTcs,
        totalExcise,
        sizes: sizeQuantities,
        dateRange: {
          from: fromDate,
          to: toDate,
        },
      };
    } else {
      let formattedData = {};

      bills.forEach((bill) => {
        const billYear = new Date(bill.createdAt).getFullYear();
        const billMonth = new Date(bill.createdAt).getMonth() + 1;
        const monthKey = `${billYear}-${billMonth}`;

        if (!formattedData[monthKey]) {
          formattedData[monthKey] = {
            year: billYear,
            month: billMonth,
            totalRevenue: 0,
            totalPratifal: 0,
            totalExcise: 0,
            totalTcs: 0,
            sizes: {},
          };
        }

        formattedData[monthKey].totalRevenue += Number(bill.total) || 0;
        formattedData[monthKey].totalPratifal += Number(bill.pratifal) || 0;
        formattedData[monthKey].totalTcs += Number(bill.tcs) || 0;
        formattedData[monthKey].totalExcise += Number(bill.fexcise) || 0;

        bill.products.forEach((product) => {
          product.sizes.forEach((size) => {
            if (!formattedData[monthKey].sizes[size.size]) {
              formattedData[monthKey].sizes[size.size] = 0;
            }
            formattedData[monthKey].sizes[size.size] += Number(size.quantity);
          });
        });
      });

      responseData = {
        aggregateData: {
          totalRevenue,
          totalPratifal,
          totalTcs,
          totalExcise,
          sizes: sizeQuantities,
        },
        monthlyData: Object.values(formattedData),
        dateRange: {
          from: fromDate,
          to: toDate,
        },
      };
    }

    return res.status(200).json({
      message: "Data fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to get analytics data" });
  }
};

const getDailyReports = async (req, res) => {
  try {
    const { billType } = req.query;

    if (!billType) {
      return res
        .status(400)
        .json({ error: "billType query parameter is required" });
    }

    const date = new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const bills = await Bill.find({
      billType: billType,
      seller: req.user?._id,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const sizeQuantities = {};
    let totalPrice = 0;

    bills.forEach((bill) => {
      bill.products.forEach((product) => {
        product.sizes.forEach((size) => {
          if (sizeQuantities[size.size]) {
            sizeQuantities[size.size] += Number(size.quantity);
          } else {
            sizeQuantities[size.size] = Number(size.quantity);
          }
        });
      });
      totalPrice += Number(bill.total);
    });

    res.status(200).json({
      data: {
        sizeQuantities,
        totalPrice: Number(totalPrice),
      },
    });
  } catch (error) {
    console.error("Error fetching daily data:", error);
    res.status(500).json({ error: "Failed to get analytics data" });
  }
};

// getting bill with respect to the customer
const getBillsByCustomer = async (req, res) => {
  try {
    const { id, month } = req.query;
    const sellerId = req?.user?._id;

    if (!id || !month) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Customer ID and month are required",
        });
    }

    const [year, monthStr] = month.split("-"); // expecting format YYYY-MM
    const inputMonth = parseInt(monthStr) - 1; // JS Date months are 0-based
    const inputYear = parseInt(year);

    const startDate = new Date(inputYear, inputMonth, 1);
    const now = new Date();

    // If future month, return empty array
    if (startDate > now) {
      return res.status(200).json({
        success: true,
        message: "No data for future months",
        stats: [],
      });
    }

    // Set end date depending on whether it's current month or past month
    let endDate;
    if (
      startDate.getMonth() === now.getMonth() &&
      startDate.getFullYear() === now.getFullYear()
    ) {
      // Current month: use today's date
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // +1 to make it exclusive
    } else {
      // Past month: end of the month
      endDate = new Date(inputYear, inputMonth + 1, 1); // first day of next month
    }

    const dailyStats = await Bill.aggregate([
      {
        $match: {
          seller: sellerId,
          customer: new mongoose.Types.ObjectId(id),
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$total" },
          fexcise: { $sum: "$fexcise" },
          tcs: { $sum: "$tcs" },
          pratifal: { $sum: "$pratifal" },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          total: 1,
          fexcise: 1,
          tcs: 1,
          pratifal: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    // console.log("daily stats: ", dailyStats);

    return res.status(200).json({
      success: true,
      message: "Aggregated daily stats for the customer",
      stats: dailyStats,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
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
  getDailyReports,
  getBillsByCustomer,
};
