import Rpi from "../../models/rpiModel.js";

// Create a new Raspberry Pi entry
export const createRpi = async (req, res) => {
  try {
    const {
      rpi_id,
      rpi_name,
      rpi_serverUrl,
      wifi_ssid,
      wifi_password,
      rpi_status,
      vehicle_no,
      owner_name,
      owner_phone,
      location,
    } = req.body;

    if (
      !rpi_id ||
      !vehicle_no ||
      !owner_name ||
      !owner_phone ||
      !location
    ) {
      return res.status(400).json({
        message:
          "All fields are required. rpi_id, vehicle_no , owner_name , owner_phone , location.",
      });
    }

    const newRpi = new Rpi({
      rpi_id,
      rpi_name,
      rpi_serverUrl,
      wifi_ssid,
      wifi_password,
      vehicle_no,
      owner_name,
      owner_phone,
      location,
      rpi_status: rpi_status || "in_active",
    });

    const savedRpi = await newRpi.save();
    console.log({success: true , message: "Raspberry Pi saved successfully " + savedRpi});
    res.status(201).json({success: true , message: "Raspberry Pi saved successfully " + savedRpi});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create Raspberry Pi",error: error });
  }
};
