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
// Use CORS with specific origin
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://iot-ads-frontend.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};


app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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
