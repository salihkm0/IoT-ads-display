const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✓ database connected success");
  } catch (error) {
    console.log("✘ Error conncting DB", error);
  }
};
module.exports = connectDB;
