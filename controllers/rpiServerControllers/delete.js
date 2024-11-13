import Rpi from"../../models/rpiModel.js";


// Delete Raspberry Pi by rpi_id
export const deleteRpi = async (req, res) => {
    try {
      const { rpi_id } = req.params;
  
      const deletedRpi = await Rpi.findOneAndDelete({ rpi_id });
  
      if (!deletedRpi) {
        return res.status(404).json({ message: "Raspberry Pi not found" });
      }
  
      res.status(200).json({ message: "Raspberry Pi deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete Raspberry Pi" });
    }
  };