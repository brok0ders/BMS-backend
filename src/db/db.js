import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/bms`
    );
    console.log(`\nMongoDB connected to ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
