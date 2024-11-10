const mongoose = require("mongoose");

const adsModelSchema = new mongoose.Schema(
  {
    cloudinaryId: String,
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    description: String,
    brand: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ads", adsModelSchema);
