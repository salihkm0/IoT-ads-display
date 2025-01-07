import express from "express";
import { createRpi } from "../controllers/rpiServerControllers/create.js";
import {
  getAllRpis,
  getWifiDetails,
  // getRpiById,
} from "../controllers/rpiServerControllers/fetch.js";
import {
  updateRpi,
  updateRpiStatus,
} from "../controllers/rpiServerControllers/update.js";
import { deleteRpi } from "../controllers/rpiServerControllers/delete.js";
import rpiModel from "../models/rpiModel.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const rpiRoutes = express.Router();

rpiRoutes
  .route("/")
  .post(protect, upload.none(), createRpi)
  .get(protect, getAllRpis);

rpiRoutes
  .route("/:id")
  // .get(getRpiById)
  .put(protect, updateRpi)
  .delete(protect, deleteRpi);

rpiRoutes.route("/status/:id").put(updateRpiStatus);
rpiRoutes.get("/get-wifi/:rpi_id" , getWifiDetails)

// Route for server check (ping)
rpiRoutes.get("/ping", (req, res) => {
  res.status(200).json({ message: "Server is online", success: true });
});

rpiRoutes.post("/update", async (req, res) => {
  // const { rpi_id } = req.params;
  const { rpi_serverUrl, rpi_status, rpi_id } = req.body;

  if (!rpi_id) {
    return res.status(400).json({
      error: "Missing required fields: id",
      success: false,
    });
  }
  console.log(`Received online notification from Pi server ${rpi_id}`);

  try {
    const rpi = await rpiModel.findOneAndUpdate(
      { rpi_id },
      { rpi_serverUrl: rpi_serverUrl ? rpi_serverUrl : "", rpi_status },
      { upsert: true, new: true }
    );

    return res
      .status(200)
      .json({ message: "RPI updated successfully.", data: rpi, success: true });
  } catch (error) {
    console.error(`Error updating RPI: ${error.message}`);
    return res
      .status(500)
      .json({ error: "Internal server error.", success: false });
  }
});

// API to update WiFi for a specific Pi
// rpiRoutes.post('/update-wifi', async (req, res) => {
//   const { pi_id, wifi_ssid, wifi_password } = req.body;

//   if (!pi_id || !wifi_ssid || !wifi_password) {
//     return res.status(400).json({ error: 'pi_id, wifi_ssid, and wifi_password are required' });
//   }

//   try {
//     // Update WiFi details in the database
//     const pi = await rpiModel.findOneAndUpdate(
//       { pi_id },
//       { wifi_ssid, wifi_password },
//       { new: true, upsert: true }
//     );

//     // Send WiFi details to the specific Raspberry Pi via Socket.IO
//     const socket = piClients[pi_id];
//     if (socket) {
//       socket.emit('update-wifi', { wifi_ssid, wifi_password });
//       console.log(`WiFi details sent to Pi ${pi_id}`);
//       res.json({ message: 'WiFi details updated and sent to Pi.' });
//     } else {
//       console.log(`Pi ${pi_id} is not connected.`);
//       res.json({ message: 'WiFi details updated but Pi is not currently connected.' });
//     }
//   } catch (error) {
//     console.error('Error updating WiFi:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

export default rpiRoutes;
