const User = require("../models/userModel");
const Game = require("../models/gameModel");
const Event = require("../models/eventModel");

const searchAll = async (req, res) => {
  const query = req.query.query; //obtenemos el query de la URL, el query se envia en la URL como ?query=loquesea.

  if (!query) {
    return res.status(200).json({ users: [], games: [], events: [] }); //si no hay query devolvemos un array vacio
  }

  const regex = new RegExp(query, "i"); //// RegExp es una clase de JavaScript que permite crear expresiones regulares y se utiliza para buscar patrones en cadenas de texto.
  // creamos una expresion regular para buscar en la base de datos, la i es para que no distinga entre mayusculas y minusculas
  try {
    // Buscamos en la base de datos los usuarios, juegos y eventos que coincidan con el query
    //  (el username que se escribe en el input de busqueda), y le decimos que solo queremos el username y avatar de los usuarios,
    //  el name y imageUrl de los juegos y el title, date, game y creator de los eventos.
    const usersPromise = User.find({ username: regex }).select(
      "username avatar"
    );
    const gamesPromise = Game.find({ name: regex }).select(
      "name imageUrl rawgId"
    );
    const eventsPromise = Event.find({ title: regex })
      .select("title date game creator")
      .populate("game", "name") // como el campo game es un ObjectId, tenemos que hacer un populate para obtener el nombre del juego, y le decimos que solo queremos el name del juego.
      .populate("creator", "username");

    // promise.all permite ejecutar varias promesas en paralelo y esperar a que todas se resuelvan o se rechacen.
    const [users, games, events] = await Promise.all([
      usersPromise,
      gamesPromise,
      eventsPromise,
    ]); //esperamos a que todas las promesas se resuelvan y guardamos los resultados en un array.

    // devolvemos los resultados en un objeto con los usuarios, juegos y eventos encontrados que coincidan con el query.
    return res.status(200).json({
      users,
      games,
      events,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al buscar", error: error.message }); //si hay un error devolvemos un error 500 que es de servidor interno
  }
};

const searchOnlyUsers = async (req, res) => {
  const query = req.query.query; //obtenemos el query de la URL, el query se envia en la URL como ?query=loquesea o como /users/:username

  if (!query) {
    return res.status(200).json({ users: [] }); //si no hay query devolvemos un array vacio
  }

  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("username avatar"); //buscamos en la base de datos los usuarios que coincidan con el query (el username que se escribe en el input de busqueda), y le decimos que solo queremos el username y avatar de los usuarios.

    return res.status(200).json({ users }); //devolvemos los resultados con los usuarios encontrados que coincidan con la busqueda.
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al buscar", error: error.message });
  }
};

const searchOnlyGames = async (req, res) => {
  const query = req.query.query; // obtenemos el query de la URL, el query se envia en la URL como ?query=loquesea.
  if (!query) {
    return res.status(200).json({ games: [] });
  }

  try {
    const games = await Game.find({
      name: { $regex: query, $options: "i" },
    }).select("name imageUrl");

    return res.status(200).json({ games });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al buscar", error: error.message });
  }
};

const searchOnlyEvents = async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(200).json({ events: [] });
  }

  const regex = new RegExp(query, "i");

  try {
    const events = await Event.find({ title: regex })
      .select("title date game creator")
      .populate("game", "name")
      .populate("creator", "username");

    return res.status(200).json({ events });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al buscar", error: error.message });
  }
};
// const searchOnlyPlatforms = async (req, res) => {
//   const query = req.query.query;

//   if (!query) {
//     return res.status(200).json({ platforms: [] });
//   }

//   const regex = new RegExp(query, "i");

//   try {
//     const platforms = await Platform.find({ name: regex }).select("name icon");

    return res.status(200).json({ platforms });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al buscar", error: error.message });
  }
};

module.exports = {
  searchAll,
  searchOnlyUsers,
  searchOnlyGames,
  searchOnlyEvents,
  searchOnlyPlatforms,
};
