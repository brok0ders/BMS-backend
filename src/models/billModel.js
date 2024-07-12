import mongoose, { Schema } from "mongoose";

const billSchema = new Schema(
  {
    billNo: {
      type: String,
    },
    billType: {
      type: String,
      enum: ["beer", "liquor"],
      default: "liquor",
      required: true,
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    seller: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        brand: {
          type: String,
          required: true,
        },
        sizes: [
          {
            size: {
              type: String,
              required: true,
            },
            quantity: { type: Number, required: true },
            price: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    ],

    excise: {
      type: String,
      required: true,
    },
    pno: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

billSchema.pre("save", async function (next) {
  const bill = this;
  if (bill.isNew) {
    const latestBill = await Bill.findOne({ company: bill.company })
      .populate({
        path: "company",
        select: "name",
        populate: {
          path: "company",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
      .exec();

    console.log(latestBill);

    if (
      latestBill &&
      latestBill.company.company &&
      latestBill.company.company.name
    ) {
      // Extract the first two letters of the company name
      const companyPrefix = latestBill.company.company.name
        .substring(0, 2)
        .toUpperCase();

      if (latestBill.billNo) {
        // Extract numeric part from billNo
        const latestBillNo = parseInt(latestBill.billNo.substring(4), 10);
        const newBillNo = (latestBillNo + 1).toString().padStart(4, "0"); // Ensure 4 digits with leading zeros
        bill.billNo = `FL${companyPrefix}${newBillNo}`;
      } else {
        bill.billNo = `FL${companyPrefix}0001`; // Starting billNo if no previous bill exists
      }
    } else {
      bill.billNo = "FLXX0001"; // Default format if no company name found
    }
  }
  next();
});

export const Bill = mongoose.model("Bill", billSchema);
