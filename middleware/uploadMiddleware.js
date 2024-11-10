const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Ensure the "uploads" folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Adding timestamp to avoid file name collisions
  },
});

// Create and export the multer instance directly
const upload = multer({ storage: storage });
module.exports = upload;
