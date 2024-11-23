import Rpi from"../../models/rpiModel.js";

// Get all Raspberry Pi entries
export const getAllRpis = async (req, res) => {
  try {
    const rpis = await Rpi.find();
    res.status(200).json({success: true , message: "Raspberry Pi fetched successfully ",  rpis : rpis});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve Raspberry Pis" , error: error});
  }
};

// Get Raspberry Pi by rpi_id
export const getRpiById = async (req, res) => {
  try {
    const { id } = req.params;
    const rpi = await Rpi.findById({ id });

    if (!rpi) {
      return res.status(404).json({ message: "Raspberry Pi not found" });
    }

    res.status(200).json({success: true , message: "Raspberry Pi fetched successfully " + rpi});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get Raspberry Pi by rpi_id", error: error });
  }
};
