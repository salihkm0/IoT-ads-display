import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./config/dbConnection.js";
import rpiRoutes from "./routes/rpiRoutes.js";
import { checkPiServerStatus } from "./utils/checkPiServerStatus.js";
import authRoutes from "./routes/authRoutes.js";
import jwtRoutes from "./routes/tokenRoutes.js";
import brandRouter from "./routes/brandRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import { swaggerSpec, swaggerUi, swaggerUiOptions } from "./swagger/swagger.js";

const app = express();
dotenv.config();
app.use(express.json());
// const corsOptions = {
//   origin: "https://iot-ads-frontend.vercel.app",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

app.use(cors());

const port = process.env.PORT || 3000;

app.use("/api", videoRoutes);
app.use("/api/rpi", rpiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", jwtRoutes);
app.use("/api/brands", brandRouter);

//* Swagger setup
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

dbConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`✓ App is running on port: ${port}`);

      setInterval(checkPiServerStatus, 300000);
      checkPiServerStatus();
    });
  })
  .catch((err) => {
    console.error("✘ Failed to connect to the database", err);
  });
