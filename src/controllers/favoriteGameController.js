const User = require("../models/userModel");

const addFavoriteGame = async (req, res) => {
  console.log("📥 Body recibido:", req.body);
  console.log("🧑‍💻 Usuario:", req.user.id);
  try {
    const userId = req.user.id; // obtenemos el user id del token que hemos decodificado en el middleware verifyToken
    const gameIds = req.body.gameIds; // Obtenemos el o los ids del juego de la peticion cuando lo indicamos en el frontend (hacemos click en el chips)

    const user = await User.findById(userId); // Buscamos al usuario en la base de datos
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!gameIds || gameIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Debe añadir al menos un juego a favoritos" });
    }

    if (gameIds.length > 5) {
      return res
        .status(400)
        .json({ message: "No puede añadir más de 5 juegos a favoritos" });
    }

    // creamos una variable que contenga los juegos que se van a añadir a favoritos,a los ids de los juegos se les hace un filtro por el cual se comprueba si el id del juego que se va a añadir ya existe en el array de favoritos del usuario poniendo para ello !user.favoriteGames,
    // al que se le hace un some, que devuelve true si al menos uno de los elementos del array cumple la condicion, y si no existe se añade a favoritos,se usa el equals porque el id es un objeto de mongoose y no un string, por lo que no se puede comparar directamente con el operador ===, ya que no son del mismo tipo y equals permite comparar objetos de mongoose con strings u otros objetos de mongoose.
    const gamesToAdd = gameIds.filter(
      (id) =>
        !user.favoriteGames.some((favoriteGamesId) =>
          favoriteGamesId.equals(id)
        )
    );

    user.favoriteGames.push(...gamesToAdd); // Añadimos los juegos a favoritos, el ... es para que si le llega un array lo añada como array y no como un solo elemento y si es un solo elemento lo añada como un solo elemento.
    console.log("🧠 User antes de guardar:", user);
    await user.save(); // lo añadimos y guardamos cambios.

    return res.status(200).json({
      message: `Se añadieron ${gamesToAdd.length} juego(s) a favoritos`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al añadir el juego a favoritos",
      error: error.message,
    });
  }
};

const deleteFavoriteGame = async (req, res) => {
  try {
    const userId = req.user.id; // obtenemos el user id del token que hemos decodificado en el middleware verifyToken
    const gameId = req.params.gameId; // Obtenemos el ID del juego de la peticion cuando lo indicamos en el frontend (hacemos click en el chips)
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.favoriteGames = user.favoriteGames.filter(
      (favoriteGamesId) => favoriteGamesId.toString() !== gameId
    ); // filtramos el array de favoritos y eliminamos el juego que queremos eliminar

    await user.save();

    return res
      .status(200)
      .json({ message: "Juego eliminado de favoritos", gameId });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el juego de favoritos",
      error: error.message,
    });
  }
};

module.exports = { addFavoriteGame, deleteFavoriteGame };
