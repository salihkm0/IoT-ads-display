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

const rpiRoutes = express.Router();

rpiRoutes.route("/rpi").post(protect,createRpi).get(protect,getAllRpis);

rpiRoutes
  .route("/rpi/:rpi_id")
  .get(getRpiById)
  .put(protect,updateRpi)
  .delete(protect,deleteRpi);

rpiRoutes.route("/rpi/status/:rpi_id").put(updateRpiStatus);

// Route for server check (ping)
rpiRoutes.get("/ping", (req, res) => {
    res.status(200).json({ message: "Server is online", success: true });
  });

rpiRoutes.post("/rpi/update", async (req, res) => {
  const { rpi_id, rpi_serverUrl, rpi_status } = req.body;

  if (!rpi_id || !rpi_serverUrl) {
    return res.status(400).json({ error: "Missing required fields: rpi_id or rpi_serverUrl" });
  }
  console.log(`Received online notification from Pi server ${rpi_id}`);

  try {
    const rpi = await rpiModel.findOneAndUpdate(
      { rpi_id }, 
      { rpi_serverUrl, rpi_status },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "RPI updated successfully.", data: rpi });
  } catch (error) {
    console.error(`Error updating RPI: ${error.message}`);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default rpiRoutes;



