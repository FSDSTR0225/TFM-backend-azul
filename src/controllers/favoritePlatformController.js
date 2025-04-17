const User = require("../models/userModel");

const addFavoritePlatform = async (req, res) => {
  try {
    const userId = req.params.userId;
    const platformId = req.body.platformId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    //Si alguna de las plataformas del usuario tiene el mismo id,aunque sea string,(some compara si al menos 1 elem cumple condicion)
    // que el que estamos recibiendo como platformId... entonces esta ya repetido y no añadirlo.
    if (user.platforms.some((platform) => platform.equals(platformId))) {
      return res.status(400).json({
        message: "Esta plataforma ya esta añadida a plataformas favoritas",
      });
    }

    user.platforms.push(platformId);
    await user.save();

    return res
      .status(200)
      .json({ message: "Plataforma añadida al perfil", platformId });
  } catch (error) {
    return res.status(500).json({
      message: "Error al añadir el juego a plataformas favoritas",
      error: error.message,
    });
  }
};

const deleteFavoritePlatform = async (req, res) => {
  try {
    const { userId, platformId } = req.params;

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
