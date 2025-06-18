const userWidgetConfig = require("../models/userWidgetConfigModel");
const User = require("../models/userModel");

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
      return res
        .status(404)
        .json({ message: "No se encontró la configuración del usuario" });
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

// const getSuggestionsUsers = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const user = await User.findById(userId).select(
//       "favoriteTags favoriteGames availability"
//     );
//     console.log("Usuario autenticado:", user);

//     if (!user) {
//       return res.status(404).json({ message: "Usuario no encontrado" });
//     }

//     if (!user.favoriteTags?.length || !user.favoriteGames?.length) {
//       // !user.availability
//       return res.status(400).json({
//         message: "Debes completar tu perfil para recibir sugerencias",
//       });
//     }

//     const suggestions = await User.find({
//       _id: { $ne: userId }, // Excluir al usuario actual, $ne significa "not equal"
//       // availability: user.availability, // Mismo estado de disponibilidad
//       favoriteTags: { $in: user.favoriteTags }, // Al menos un tag favorito en común
//       favoriteGames: { $in: user.favoriteGames }, // Al menos un juego favorito en común
//       friends: { $ne: userId }, // Excluir amigos para evitar sugerir amigos
//     })
//       .select("username avatar ")
//       .limit(5) // Limitar a 5 sugerencias
//       .lean(); // Convertir a objetos JavaScript simples para mejor rendimiento

//     return res.status(200).json({
//       message: "Sugerencias de usuarios obtenidas correctamente",
//       suggestions: suggestions || [],
//     });
//   } catch (error) {
//     console.error("Error al obtener sugerencias de usuarios", error);
//     return res.status(500).json({ error: error.message });
//   }
// };

const getSuggestionsUsers = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select(
      "favoriteTags favoriteGames friends"
    );
    console.log("Usuario autenticado:", user);

    if (!user) {
      console.log("No se encontró el usuario");
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const allTags = user.favoriteTags
      ? Object.values(user.favoriteTags).flat()
      : [];
    console.log("Tags aplanados:", allTags);

    if (!allTags.length || !user.favoriteGames?.length) {
      console.log(
        "Faltan tags o juegos favoritos:",
        allTags,
        user.favoriteGames
      );
      return res.status(400).json({
        message: "Debes completar tu perfil para recibir sugerencias",
      });
    }

    // Convierte los IDs de juegos favoritos a ObjectId
    const favoriteGamesObjectIds = user.favoriteGames.map((id) =>
      typeof id === "string" ? new mongoose.Types.ObjectId(id) : id
    );
    console.log("favoriteGamesObjectIds:", favoriteGamesObjectIds);

    // Log de amigos
    console.log("Amigos del usuario:", user.friends);

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
      "friends.user": { $ne: userId }, // <-- usa esto si friends es array de objetos
    };
    console.log("Query de sugerencias:", JSON.stringify(query, null, 2));

    const suggestions = await User.find(query)
      .select("username avatar favoriteTags favoriteGames friends")
      .limit(5)
      .lean();

    console.log("Sugerencias encontradas:", suggestions);

    return res.status(200).json({
      message: "Sugerencias de usuarios obtenidas correctamente",
      suggestions: suggestions || [],
    });
  } catch (error) {
    console.error("Error al obtener sugerencias de usuarios", error);
    return res.status(500).json({ error: error.message });
  }
};

const getSuggestionsGames = async (req, res) => {};

module.exports = {
  getWidgetConfig,
  addWidget,
  updateWidget,
  updateMultiWidgets,
  deleteWidget,
  getSuggestionsUsers,
  getSuggestionsGames,
};
