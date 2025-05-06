const User = require("../models/userModel");

const addFavoritePlatform = async (req, res) => {
  try {
    const userId = req.user._id; // obtenemos el user id del token que hemos decodificado en el middleware verifyToken
    const platformsId = req.body.platformsId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!platformsId || platformsId.length === 0) {
      return res
        .status(400)
        .json({ message: "Debe añadir al menos una plataforma a favoritos" });
    }

    if (platformsId.length > 3) {
      // Limite de 3 plataformas favoritas
      return res
        .status(400)
        .json({ message: "No puede añadir más de 3 plataformas a favoritos" });
    }

    const platformsToAdd = platformsId.filter(
      (id) => !user.platforms.some((p) => p.equals(id))
    ); // De todos los id que me ha mandado el usuario, me voy a quedar solo con los que aún no están en sus favoritos.
    //user.platforms es un array que contiene las plataformas faoritas del user,usamos some para buscar las que no coincidan y por tanto no tenga el usuario, y si no existe se añade a favoritos,se usa el equals porque el id es un objeto de mongoose y no un string, por lo que no se puede comparar directamente con el operador ===, ya que no son del mismo tipo y equals permite comparar objetos de mongoose con strings u otros objetos de mongoose
    //Si alguna de las plataformas del usuario tiene el mismo id,aunque sea string,(some compara si al menos 1 elem cumple condicion)
    // que el que estamos recibiendo como platformId... entonces esta ya repetido y no añadirlo.

    user.platforms.push(...platformsToAdd);
    await user.save();

    return res.status(200).json({
      message: `Se añadieron ${platformsToAdd.length} plataforma(s) a favoritos`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al añadir el juego a plataformas favoritas",
      error: error.message,
    });
  }
};

const deleteFavoritePlatform = async (req, res) => {
  try {
    const userId = req.user._id; // obtenemos el user id del token que hemos decodificado en el middleware verifyToken
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
