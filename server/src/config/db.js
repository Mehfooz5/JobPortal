import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    const url = process.env.MONGOD_URI;
    await mongoose.connect(url);
    console.log("Mongodb Connected......");
  } catch (error) {
    console.log("Error: ", error);
    process.exit(1);
  }
};

export default ConnectDB;
