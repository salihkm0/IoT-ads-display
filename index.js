import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/dbConnection.js";
import uploadRoutes from "./routes/videoRoutes.js";
import rpiRoutes from "./routes/rpiRoutes.js";
import { checkPiServerStatus } from "./utils/checkPiServerStatus.js";

const app = express();
dotenv.config();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/api", uploadRoutes);
app.use("/api", rpiRoutes);

dbConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`✓ App is running on port: ${port}`);

      // Start the status check
      setInterval(checkPiServerStatus, 300000); // Run every 5 minutes
      checkPiServerStatus();
    });
  })
  .catch((err) => {
    console.error("✘ Failed to connect to the database", err);
  });
