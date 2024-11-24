import Rpi from "../models/rpiModel.js";
import axios from "axios";

// Function to check the status of each Pi server
export const checkPiServerStatus = async () => {
  try {
    // Get all Pi servers from the database
    const piServers = await Rpi.find();

    // Loop through each server and check its status
    await Promise.all(
      piServers.map(async (server) => {
        try {
          // Attempt to send a request to the server
          const response = await axios.get(`${server.rpi_serverUrl}/status`, { timeout: 5000 });

          // If the server responds, set status to "active"
          if (response.status === 200) {
            await Rpi.findByIdAndUpdate(server._id, { rpi_status: "active" });
            console.log(`Server ${server.rpi_name} is active`);
          }
        } catch (error) {
          // If the server doesn't respond, set status to "in_active"
          await Rpi.findByIdAndUpdate(server._id, { rpi_status: "in_active" });
          console.log(`Server ${server.rpi_name} is inactive`);
        }
      })
    );
  } catch (error) {
    console.error("Error checking Pi server statuses:", error);
  }
};
