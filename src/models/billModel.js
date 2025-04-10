// import mongoose, { Schema } from "mongoose";

// const billSchema = new Schema(
//   {
//     billNo: {
//       type: String,
//     },
//     billType: {
//       type: String,
//       enum: ["beer", "liquor"],
//       default: "liquor",
//       required: true,
//     },
//     company: {
//       type: mongoose.Types.ObjectId,
//       ref: "Company",
//       required: true,
//     },
//     customer: {
//       type: mongoose.Types.ObjectId,
//       ref: "Customer",
//       required: true,
//     },
//     seller: {
//       type: mongoose.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     products: [
//       {
//         brand: {
//           type: String,
//           required: true,
//         },
//         sizes: [
//           {
//             size: {
//               type: String,
//               required: true,
//             },
//             quantity: { type: Number, required: true },
//             price: {
//               type: Number,
//               required: true,
//             },
//           },
//         ],
//       },
//     ],

//     excise: {
//       type: String,
//       required: true,
//     },
//     pno: {
//       type: String,
//       required: true,
//     },
//     total: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     tcs: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     pratifal: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// billSchema.pre("save", async function (next) {
//   const bill = await this.populate({
//     path: "company",
//     select: "name",
//     populate: {
//       path: "company",
//       select: "name",
//     },
//   });
//   if (bill.isNew) {
//     const latestBill = await Bill.findOne({ company: bill.company })
//       .populate({
//         path: "company",
//         select: "name",
//         populate: {
//           path: "company",
//           select: "name",
//         },
//       })
//       .sort({ createdAt: -1 })
//       .exec();
//     const companyPrefix = bill.company?.company?.name
//       .substring(0, 2)
//       .toUpperCase();
//     console.log("Prefix: " + companyPrefix);
//     if (latestBill) {
//       // Extract numeric part from billNo
//       const latestBillNo = parseInt(latestBill.billNo.substring(4), 10);
//       const newBillNo = (latestBillNo + 1).toString().padStart(4, "0"); // Ensure 4 digits with leading zeros
//       bill.billNo = `FL${companyPrefix}${newBillNo}`;
//     } else {
//       bill.billNo = `FL${companyPrefix}0001`; // Starting billNo if no previous bill exists
//     }
//   }
//   next();
// });

// export const Bill = mongoose.model("Bill", billSchema);
import mongoose, { Schema } from "mongoose";

const billSchema = new Schema(
  {
    billNo: {
      type: String,
    },
    billType: {
      type: String,
      enum: ["beer", "liquor", "cl"],
      default: "liquor",
      required: true,
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      required: function () {
        return this.billType !== "cl";
      },
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
    paid: {
      type: Number,
      required: true,
      default: 0,
    },
    fexcise: {
      type: Number,
      required: true,
      default: 0,
    },
    tcs: {
      type: Number,
      required: true,
      default: 0,
    },
    pratifal: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

billSchema.pre("save", async function (next) {
  if (this.isNew) {
    // For CL type, use a different prefix and find latest CL bill
    if (this.billType === "cl") {
      const latestClBill = await Bill.findOne({ billType: "cl" })
        .sort({ createdAt: -1 })
        .exec();

      if (latestClBill) {
        // Extract numeric part from billNo
        const latestBillNo = parseInt(latestClBill?.billNo.substring(2), 10);
        const newBillNo = (latestBillNo + 1).toString().padStart(4, "0");
        this.billNo = `CL${newBillNo}`;
      } else {
        this.billNo = `CL0001`; // Starting billNo for CL type
      }
    } else {
      // Existing logic for beer and liquor
      const bill = await this.populate({
        path: "company",
        select: "name",
        populate: {
          path: "company",
          select: "name",
        },
      });

      const latestBill = await Bill.findOne({
        company: bill.company,
        billType: { $ne: "cl" }, // Exclude CL type bills
      })
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

      const companyPrefix = bill.company?.company?.name
        .substring(0, 2)
        .toUpperCase();
      console.log("Prefix: " + companyPrefix);

      if (latestBill) {
        // Extract numeric part from billNo
        const latestBillNo = parseInt(latestBill.billNo.substring(4), 10);
        const newBillNo = (latestBillNo + 1).toString().padStart(4, "0");
        this.billNo = `FL${companyPrefix}${newBillNo}`;
      } else {
        this.billNo = `FL${companyPrefix}0001`; // Starting billNo if no previous bill exists
      }
    }
  }
  next();
});

export const Bill = mongoose.model("Bill", billSchema);
