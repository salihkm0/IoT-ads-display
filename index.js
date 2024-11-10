const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./config/dbConnection");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use('/api', uploadRoutes);

dbConnection()
  .then(() => {
    app.listen(port, () => {
      const portMessage = `✓ App is running on port: ${port}`;
      console.log(`${portMessage}`);
    });
  })
  .catch((err) => {
    console.error("✘ Failed to connect to the database", err);
  });
