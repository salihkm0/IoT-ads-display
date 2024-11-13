import Rpi from"../../models/rpiModel.js";

// Get all Raspberry Pi entries
export const getAllRpis = async (req, res) => {
  try {
    const rpis = await Rpi.find();
    res.status(200).json(rpis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve Raspberry Pis" });
  }
};

// Get Raspberry Pi by rpi_id
export const getRpiById = async (req, res) => {
  try {
    const { rpi_id } = req.params;
    const rpi = await Rpi.findOne({ rpi_id });

    if (!rpi) {
      return res.status(404).json({ message: "Raspberry Pi not found" });
    }

    res.status(200).json(rpi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get Raspberry Pi by rpi_id" });
  }
};
