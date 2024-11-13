import Rpi from"../../models/rpiModel.js";

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
    } = req.body;

    // Check if required fields are missing
    if (!rpi_id || !rpi_name || !rpi_serverUrl || !wifi_ssid || !wifi_password) {
      return res.status(400).json({
        message: "Missing required fields. rpi_id, rpi_name, rpi_serverUrl, wifi_ssid, and wifi_password are required.",
      });
    }

    // Create a new Raspberry Pi instance
    const newRpi = new Rpi({
      rpi_id,
      rpi_name,
      rpi_serverUrl,
      wifi_ssid,
      wifi_password,
      rpi_status: rpi_status || "in_active", // Default to "in_active" if not provided
    });

    // Save the new Raspberry Pi entry to the database
    const savedRpi = await newRpi.save();
    console.log("Saved : " + savedRpi)
    // Send a success response with the saved data
    res.status(201).json(savedRpi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create Raspberry Pi" });
  }
};
