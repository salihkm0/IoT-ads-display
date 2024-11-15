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

const rpiRoutes = express.Router();
rpiRoutes.route("/rpi").post(createRpi).get(getAllRpis);

rpiRoutes
  .route("/rpi/:rpi_id")
  .get(getRpiById)
  .put(updateRpi)
  .delete(deleteRpi);

rpiRoutes.route("/rpi/status/:rpi_id").put(updateRpiStatus);

// Route for server check (ping)
rpiRoutes.get("/ping", (req, res) => {
    res.status(200).json({ message: "Server is online", success: true });
  });


rpiRoutes.post("/notify-online", async (req, res) => {
    const { rpi_id } = req.body;
  
    try {
      const piServer = await rpiModel.findOne({ rpi_id });
      if (piServer) {
        piServer.rpi_status = "active";
        await piServer.save();
        console.log(`Received online notification from Pi server ${rpi_id}`);
        res.status(200).json({ message: "Status updated to active" });
      } else {
        res.status(404).json({ message: "Pi server not found" });
      }
    } catch (error) {
      console.error("Error updating Pi server status:", error);
      res.status(500).json({ message: "Failed to update Pi server status" });
    }
  });

export default rpiRoutes;



