import mongoose from "mongoose";

const adsModelSchema = new mongoose.Schema(
  {
    cloudinaryId: String,
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    description: String,
    brand: String,
    fileSize : Number,
    expiryDate: Date,
    status : { type: String, enum:[ "active", "expired"] ,default: "active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ads", adsModelSchema);
