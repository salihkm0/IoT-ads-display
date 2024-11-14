import mongoose from "mongoose";

const rpiModelSchema = new mongoose.Schema(
  {
    rpi_id: { type: String, unique: true },
    rpi_name: String,
    rpi_serverUrl: String,
    wifi_ssid: String,
    wifi_password: String,
    vehicle_no : String,
    owner_name: String,
    owner_phone: String,
    location: String,
    rpi_status: { type: String, enum: ["active", "in_active"], default: "in_active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("rpi", rpiModelSchema);
