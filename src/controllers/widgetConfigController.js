const userWidgetConfig = require("../models/userWidgetConfigModel");

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
    friends: { w: 3, h: 2 },
    calendar: { w: 2, h: 3 },
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

module.exports = {
  getWidgetConfig,
  addWidget,
  updateWidget,
  updateMultiWidgets,
  deleteWidget,
};
