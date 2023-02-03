const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
require("dotenv").config();
const uri = process.env.ATLAS_URI;
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.once("open", () => {
      console.log("MongoDB database connection established successfully");
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

module.exports = connectDB;
