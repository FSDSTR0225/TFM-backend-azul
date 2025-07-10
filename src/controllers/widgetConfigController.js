const userWidgetConfig = require("../models/userWidgetConfigModel");
const User = require("../models/userModel");
const Game = require("../models/gameModel");
const Event = require("../models/eventModel");
const mongoose = require("mongoose");
const JoinEventRequest = require("../models/joinEventRequestModel");

const getWidgetConfig = async (req, res) => {
  const userId = req.user.id; // Obtenemos el ID del usuario autenticado desde el token

  try {
    // Buscamos la configuración de widgets del usuario en la base de datos
    const userConfig = await userWidgetConfig.findOne({ user: userId });

    if (!userConfig) {
      return res.status(200).json({
        widgets: [],
        created: false, // útil para saber si es la primera vez
      });
    }

    return res.status(200).json({
      widgets: userConfig.widgets,
      created: true,
    });
  } catch (error) {
    console.error("Error al obtener los widgets", error);
    return res.status(500).json({ error: error.message });
  }
};

const addWidget = async (req, res) => {
  const userId = req.user.id;
  const widgetType = req.params.widgetType;
  const possibleWidgets = [
    "friends",
    "calendar",
    "gamification",
    "userSuggestions",
    "eventSuggestions",
    "iaSuggestions",
    "popularEvents",
    "gameSuggestions",
    "gameStats",
  ];

  if (!possibleWidgets.includes(widgetType)) {
    return res.status(400).json({ message: "Tipo de widget no válido" });
  }

  // Tamaños por defecto según el tipo
  const defaultSizes = {
    friends: { w: 3, h: 3 },
    calendar: { w: 3, h: 3 },
    gamification: { w: 4, h: 2 },
    userSuggestions: { w: 3, h: 2 },
    eventSuggestions: { w: 3, h: 2 },
    iaSuggestions: { w: 3, h: 2 },
    popularEvents: { w: 3, h: 2 },
    gameSuggestions: { w: 3, h: 2 },
    gameStats: { w: 2, h: 2 },
  };

  const { w, h } = defaultSizes[widgetType];

  try {
    let userConfig = await userWidgetConfig.findOne({ user: userId });

    // Si no existe aún config del usuario → la creamos
    if (!userConfig) {
      const newConfig = new userWidgetConfig({
        user: userId,
        widgets: [
          {
            type: widgetType,
            x: 0,
            y: 0,
            w,
            h,
            hidden: false,
          },
        ],
      });

      await newConfig.save();

      return res.status(201).json({
        message: "Widget añadido",
        widgets: newConfig.widgets,
      });
    }

    // Si ya tiene config, verificamos que no exista ya el widget
    const alreadyExists = userConfig.widgets.some(
      (widget) => widget.type === widgetType
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "El widget ya existe" });
    }

    // Lo añadimos
    userConfig.widgets.push({
      type: widgetType,
      x: 0,
      y: 0,
      w,
      h,
      hidden: false,
    });

    await userConfig.save();

    return res.status(201).json({
      message: "Widget añadido",
      widgets: userConfig.widgets,
    });
  } catch (error) {
    console.error("Error al añadir el widget", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateWidget = async (req, res) => {
  const userId = req.user.id;
  const { widgetId } = req.params;
  const { x, y, w, h, hidden } = req.body;

  try {
    const userConfig = await userWidgetConfig.findOne({ user: userId });

    if (!userConfig) {
      return res
        .status(404)
        .json({ message: "No se encontró la configuración del usuario" });
    }

    const widget = userConfig.widgets.id(widgetId);
    if (!widget) {
      return res.status(404).json({ message: "Widget no encontrado" });
    }

    // Actualizamos solo los campos que hayan llegado
    if (x !== undefined) widget.x = x;
    if (y !== undefined) widget.y = y;
    if (w !== undefined) widget.w = w;
    if (h !== undefined) widget.h = h;
    if (hidden !== undefined) widget.hidden = hidden;

    await userConfig.save();
    return res.status(200).json({
      message: "Widget actualizado correctamente",
      widget,
    });
  } catch (error) {
    console.error("Error al actualizar el widget", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateMultiWidgets = async (req, res) => {
  const userId = req.user.id;
  const updates = req.body; // array de objetos: [{ id, x, y, w, h, hidden }, ...]

  try {
    const userConfig = await userWidgetConfig.findOne({ user: userId });

    if (!userConfig) {
      return res
        .status(404)
        .json({ message: "No se encontró la configuración del usuario" });
    }

    updates.forEach(({ id, x, y, w, h, hidden }) => {
      const widget = userConfig.widgets.id(id);
      if (widget) {
        if (x !== undefined) widget.x = x;
        if (y !== undefined) widget.y = y;
        if (w !== undefined) widget.w = w;
        if (h !== undefined) widget.h = h;
        if (hidden !== undefined) widget.hidden = hidden;
      }
    });

    await userConfig.save();

    return res.status(200).json({
      message: "Widgets actualizados correctamente",
      widgets: userConfig.widgets,
    });
  } catch (error) {
    console.error("Error al actualizar widgets", error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteWidget = async (req, res) => {
  const userId = req.user.id;
  const { widgetId } = req.params;

  try {
    const userConfig = await userWidgetConfig.findOne({ user: userId });

    if (!userConfig) {
      return res.status(200).json({
        message: "No hay configuración de widgets para este usuario",
        widgets: [],
      });
    }

    const widget = userConfig.widgets.id(widgetId);
    if (!widget) {
      return res.status(404).json({ message: "Widget no encontrado" });
    }

    widget.remove(); // elimina el subdocumento
    await userConfig.save();

    return res.status(200).json({
      message: "Widget eliminado correctamente",
      widgets: userConfig.widgets,
    });
  } catch (error) {
    console.error("Error al eliminar el widget", error);
    return res.status(500).json({ error: error.message });
  }
};

const getSuggestionsUsers = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId)
      .select(
        "favoriteTags favoriteGames friends suggestedUsers suggestedUsersLastUpdate"
      )
      .lean();
    // console.log("Usuario autenticado:", user);

    if (!user) {
      // console.log("No se encontró el usuario");
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const allTags = user.favoriteTags
      ? Object.values(user.favoriteTags).flat() //usamos Object.values para obtener un array de los valores de favoriteTags y luego flat para aplanar el array
      : [];
    // console.log("Tags aplanados:", allTags);

    if (!allTags.length || !user.favoriteGames?.length) {
      // console.log(
      //   "Faltan tags o juegos favoritos:",
      //   allTags,
      //   user.favoriteGames
      // );
      return res.status(400).json({
        message: "Debes completar tu perfil para recibir sugerencias",
      });
    }

    const now = new Date();
    const lastUpdate = user.suggestedUsersLastUpdated;
    const hoursPassed = lastUpdate
      ? (now - new Date(lastUpdate)) / 36e5
      : Infinity; //36e5 es 1000 * 60 * 60, que convierte milisegundos a horas e infinity si no hay lastUpdate

    //needNewSuggestions es true si no hay sugerencias, si hay menos de 3 sugerencias o si han pasado más de 72 horas desde la última actualización
    const needNewSuggestions =
      !user.suggestedUsers ||
      user.suggestedUsers.length < 3 ||
      hoursPassed > 72;

    let finalSuggestions = [];

    // si es true, convertimos los IDs de los juegos favoritos del usuario a ObjectId para poder usarlos en la query
    if (needNewSuggestions) {
      const favoriteGamesObjectIds = user.favoriteGames.map((id) =>
        typeof id === "string" ? new mongoose.Types.ObjectId(id) : id
      );

      // Log de la query
      const query = {
        _id: { $ne: userId },
        $or: [
          { "favoriteTags.genres": { $in: allTags } },
          { "favoriteTags.modes": { $in: allTags } },
          { "favoriteTags.others": { $in: allTags } },
          { "favoriteTags.themes": { $in: allTags } },
        ],
        favoriteGames: { $in: favoriteGamesObjectIds },
        "friends.user": { $ne: userId }, // si friends es array de objetos usamos $ne para excluir al usuario autenticado
        _id: { $nin: user.suggestedUsers || [] }, // evita repetir usuarios ya sugeridos
      };
      // console.log("Query de sugerencias:", JSON.stringify(query, null, 2));

      const newSuggestions = await User.find(query)
        .select("username avatar favoriteTags favoriteGames friends")
        .limit(5)
        .lean();

      // Guardamos las sugerencias nuevas en el usuario
      await User.findByIdAndUpdate(userId, {
        suggestedUsers: newSuggestions.map((user) => user._id),
        suggestedUsersLastUpdated: now,
      });

      //ahora finalSuggestions es igual a las nuevas sugerencias
      finalSuggestions = newSuggestions;
    } else {
      // Si no necesitamos nuevas sugerencias, buscamos las sugerencias ya guardadas y buscamos en el usuario los _id: de los usuarios que están en suggestedUsers
      finalSuggestions = await User.find({
        _id: { $in: user.suggestedUsers },
      })
        .select("username avatar favoriteTags favoriteGames friends")
        .lean();
    }

    return res.status(200).json({
      message: "Sugerencias de usuarios obtenidas correctamente",
      suggestions: finalSuggestions,
    });
  } catch (error) {
    console.error("Error al obtener sugerencias de usuarios", error);
    return res.status(500).json({ error: error.message });
  }
};

const getSuggestionsGames = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select(
      "favoriteGames favoriteTags gameSuggestions lastGameSuggestionUpdate"
    );

    if (!user) {
      return res.status(400).json("Usuario no encontrado");
    }

    const now = new Date();

    // Si ya tiene sugerencias válidas (no expiradas), devuélvelas
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    const timePassed = now - user.lastGameSuggestionUpdate;

    if (user.gameSuggestions.length > 0 && timePassed < THREE_DAYS_MS) {
      const games = await Game.find({
        _id: { $in: user.gameSuggestions },
      })
        .populate("platforms", "name")
        .select("name imageUrl screenshots tags platforms");

      // 🧼 Limpiar los IDs que ya no existen
      const validIds = games.map((g) => g._id.toString());

      if (validIds.length < user.gameSuggestions.length) {
        user.gameSuggestions = validIds;
        await user.save(); // Actualizamos la lista
      }

      const timeLeft = THREE_DAYS_MS - timePassed;

      return res.status(200).json({
        gamesSuggested: games,
        nextUpdate: timeLeft,
      });
    }

    // Si no hay sugerencias guardadas o han expirado, generamos nuevas
    const tagPreferences = [
      ...user.favoriteTags.genres,
      ...user.favoriteTags.themes,
      ...user.favoriteTags.modes,
      ...user.favoriteTags.others,
    ];

    const excludedGames = [
      ...user.favoriteGames.map((id) => id.toString()),
      ...user.gameSuggestions.map((id) => id.toString()),
    ];

    const newGamesRaw = await Game.aggregate([
      {
        $match: {
          tags: { $in: tagPreferences },
          _id: {
            $nin: excludedGames.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
      { $sample: { size: 10 } }, // más juegos para poder filtrar luego
    ]);

    // ⚠️ Luego necesitas populating manualmente porque aggregate no permite populate directamente:
    const newGameIds = newGamesRaw.map((g) => g._id);
    const newGames = await Game.find({ _id: { $in: newGameIds } })
      .populate("platforms", "name")
      .select("name imageUrl screenshots tags platforms")
      .limit(5); // solo te quedas con los 5 primeros válidos

    user.gameSuggestions = newGames.map((g) => g._id);
    user.lastGameSuggestionUpdate = now;
    await user.save();

    return res.status(200).json({
      gamesSuggested: newGames,
      nextUpdate: THREE_DAYS_MS,
    });
  } catch (error) {
    console.error("Error al sugerir juegos", error);
    res.status(500).json({ error: error.message });
  }
};

const getSuggestionsEvents = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId)
      .populate("favoriteGames")
      .populate("favoriteTags")
      .lean(); // Usamos .lean() para obtener un objeto JavaScript simple

    if (!user) {
      return res.status(400).json("Usuario no encontrado");
    }

    if (!user.favoriteTags) {
      return res
        .status(200)
        .json({ events: [], message: "Aún no has configurado tags favoritos" });
    }

    const tagPreferences = [
      ...user.favoriteTags.genres,
      ...user.favoriteTags.themes,
      ...user.favoriteTags.modes,
      ...user.favoriteTags.others,
    ];

    // Buscamos los eventos en los que el usuario participa y cogemos los juegos de esos eventos
    const userEvents = await Event.find({
      participants: userId,
    }).populate("game");

    // Convertimos los IDs de los juegos de los eventos y los juegos favoritos del usuario a strings para poder compararlos
    const gamesFromEvents = userEvents.map((ev) => ev.game._id.toString());
    const gamesFromFavorites = user.favoriteGames.map((g) => g._id.toString());

    // Combinamos los juegos de los eventos y los favoritos del usuario, eliminando duplicados con new Set que convierte el array en un Set (colección de valores únicos) y luego lo convertimos de nuevo a array con el spread operator
    const userInterestGames = [
      ...new Set([...gamesFromEvents, ...gamesFromFavorites]),
    ];

    const now = new Date();

    //Buscamos eventos que sean mayor a hoy, que no requieran aprobacion, que no sean del usuario autenticado y que no tenga el usuario como participante
    const publicEvents = await Event.find({
      date: { $gt: now },
      creator: { $ne: userId },
      participants: { $ne: userId }, //$ne: userId para excluir eventos en los que el usuario ya es participante
      requiresApproval: false, // Excluir eventos que requieran aprobación
    })
      .populate("game platform")
      .populate("participants", "username avatar") // Aseguramos que los eventos tengan los datos del creador y los participantes
      .populate("creator", "username avatar") // Aseguramos que los eventos tengan
      .sort({ date: 1 })
      .limit(50) // Aseguramos que los eventos tengan los datos del juego y la plataforma, los traemos ordenados por fecha y limitamos a 50 para no sobrecargar la consulta
      .lean();
    // filtramos lo eventos buscando los que coincidan con los juegos relacionados del usuario y sus tags favoritos, hac
    const filteredEvents = publicEvents.filter((event) => {
      const gameId = event.game._id.toString(); //cogemos el ID del juego del evento y lo convertimos a string para poder compararlo
      const gameTags = event.game.tags || []; // Obtenemos las tags del juego del evento, si no tiene tags, devolvemos un array vacío

      const matchesGame = userInterestGames.includes(gameId); // comprobamos si el id de los juegos de los eventos coincide con los juegos de interes del usuario
      const matchesTags = gameTags.some((tag) => tagPreferences.includes(tag)); // comprobamos si alguna de las tags del juego del evento coincide con las tags favoritas del usuario

      return matchesGame || matchesTags; // Retornamos true si el evento coincide con algún juego de interés o alguna tag favorita del usuario
    });

    // Devolver máximo 5 sugerencias
    const suggestions = filteredEvents.slice(0, 4).map((event) => ({
      ...event,
      creator: event.creator.username,
      creatorAvatar: event.creator.avatar,
      participants: event.participants.map((p) => ({
        username: p.username,
        avatar: p.avatar,
      })),
    }));

    if (suggestions.length === 0) {
      return res.status(200).json({
        events: [],
        message: "No hay sugerencias disponibles por ahora.",
      });
    }

    return res.status(200).json({ events: suggestions });
  } catch (error) {
    console.error("Error al obtener eventos sugeridos:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  getWidgetConfig,
  addWidget,
  updateWidget,
  updateMultiWidgets,
  deleteWidget,
  getSuggestionsUsers,
  getSuggestionsGames,
  getSuggestionsEvents,
};

// const getSuggestionsGames = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const user = await User.findById(userId).select(
//       "favoriteGames favoriteTags"
//     );

//     if (!user) {
//       return res.status(400).json("Usuario no encontrado");
//     }

//     //Convertimos en array plano los favoriteTags, usamos el spread operator para aplanar los arrays de tags y añadirlos a un solo array
//     const tagPreferences = [
//       ...user.favoriteTags.genres,
//       ...user.favoriteTags.themes,
//       ...user.favoriteTags.modes,
//       ...user.favoriteTags.others,
//     ];

//     // excluir los juegos favoritos del usuario de las sugerencias,recorremos el array de juegos favoritos del usuario y convertimos cada ID a string para poder compararlos con los IDs de los juegos en la base de datos
//     const excludedGames = user.favoriteGames.map((game) => game.toString());

//     // Buscamos juegos que coincidan con los tags favoritos del usuario ($in: tagPreferences) y que no estén en los juegos favoritos del usuario (_id: { $nin: excludedGames })
//     const gamesSuggested = await Game.find({
//       tags: {
//         $in: tagPreferences,
//       },
//       _id: { $nin: excludedGames },
//     }).limit(5);

//     // AÑADIR LOGICA DE BUSQUEDA EN RAWG SI NO HAY JUEGOS SUGERIDOS EN LA BASE DE DATOS + ADELANTE

//     return res.status(200).json({ gamesSuggested });
//   } catch (error) {
//     console.error("Error al sugerir juegos", error);
//     res.status(500).json({ error: error.message });
//   }
// };
