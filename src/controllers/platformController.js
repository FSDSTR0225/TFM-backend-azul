const Platform = require("../models/platformModel");

const getPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find();
    return res
      .status(200)
      .json({ message: "Plataformas cargadas con éxito", platforms });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener plataformas", error: error.message });
  }
};

module.exports = getPlatforms;
