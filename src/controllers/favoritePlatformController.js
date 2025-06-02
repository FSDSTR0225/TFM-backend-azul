const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");

const addFavoritePlatform = async (req, res) => {
  try {
    const userId = req.user.id;
    const platformsId = req.body.platformsIds;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!platformsId || platformsId.length === 0) {
      return res.status(400).json({ message: "Devi selezionare almeno una piattaforma." });
    }
    if (platformsId.length > 3) {
      return res.status(400).json({ message: "Non puoi selezionare più di 3 piattaforme." });
    }
    const platformsToAdd = platformsId
      .map(id => new mongoose.Types.ObjectId(id))
      .filter(id => !user.platforms.some(p => p.equals(id)));
    user.platforms.push(...platformsToAdd);
    await user.save();
    return res.status(200).json({
      message: `Aggiunte ${platformsToAdd.length} piattaforma(e) ai preferiti.`,
    });
  } catch (error) {
    console.error("❌ Errore interno:", error);
    return res.status(500).json({
      message: "Errore durante l'aggiunta della piattaforma.",
      error: error.message,
    });
  }
};

const deleteFavoritePlatform = async (req, res) => {
  try {
    const userId = req.user.id; // obtenemos el user id del token que hemos decodificado en el middleware verifyToken
    const { platformId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.platforms = user.platforms.filter(
      // recorremos el array platforms del usuario
      //  y nos quedamos con el platform id(convertido a string) que no coincia con el platformId(eliminando el platformId que SI coincide)
      (platformsId) => platformsId.toString() !== platformId
    );

    await user.save();
    return res
      .status(200)
      .json({ message: "Plataforma eliminada de favoritos", platformId });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar la paltaforma de favoritos",
      error: error.message,
    });
  }
};

module.exports = { addFavoritePlatform, deleteFavoritePlatform };
