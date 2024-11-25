import express from "express";
import { createRpi } from "../controllers/rpiServerControllers/create.js";
import {
  getAllRpis,
  getRpiById,
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

rpiRoutes.route("/rpi").post(protect,upload.none(), createRpi).get(protect, getAllRpis);

rpiRoutes
  .route("/rpi/:id")
  .get(getRpiById)
  .put(protect, updateRpi)
  .delete(protect, deleteRpi);

rpiRoutes.route("/rpi/status/:id").put(updateRpiStatus);

// Route for server check (ping)
rpiRoutes.get("/ping", (req, res) => {
  res.status(200).json({ message: "Server is online", success: true });
});

rpiRoutes.post("/rpi/update", async (req, res) => {
  // const { rpi_id } = req.params;
  const { rpi_serverUrl, rpi_status,rpi_id } = req.body;

  if (!rpi_id || !rpi_serverUrl) {
    return res
      .status(400)
      .json({
        error: "Missing required fields: id or rpi_serverUrl",
        success: false,
      });
  }
  console.log(`Received online notification from Pi server ${rpi_id}`);

  try {
    const rpi = await rpiModel.findOneAndUpdate(
      { rpi_id },
      { rpi_serverUrl, rpi_status },
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

export default rpiRoutes;
