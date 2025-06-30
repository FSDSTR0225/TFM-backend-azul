const User = require("../models/userModel");

const addTags = async (req, res) => {
  const userId = req.user.id;
  const tagsType = req.params.tagsType;
  const { tag } = req.body; // tag debe ser un string

  const possibleTags = ["genres", "modes", "themes", "others"];

  if (!possibleTags.includes(tagsType)) {
    return res.status(400).json({ message: "Tags no válido" });
  }

  try {
    const user = await User.findById(userId);
    let userTags = user.favoriteTags[tagsType] || [];

    // Si ya tiene 5 tags, no añadir más
    if (userTags.length >= 5) {
      return res
        .status(400)
        .json({ message: "No puedes añadir más de 5 tags" });
    }

    // Si el tag ya existe, no añadirlo de nuevo
    if (userTags.includes(tag)) {
      return res.status(200).json({
        message: "Tag ya añadido",
        favoriteTags: user.favoriteTags,
      });
    }

    userTags.push(tag);
    user.favoriteTags[tagsType] = userTags;

    await user.save();

    return res.status(200).json({
      message: "Tag añadido correctamente",
      favoriteTags: user.favoriteTags,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al añadir el tag",
      error: error.message,
    });
  }
};

const deleteTags = async (req, res) => {
  const userId = req.user.id; // Obtenemos el userId para identificar al usuario
  const { tagsType, tag } = req.params; // Obtenemos el tipo de tags y el tag a eliminar desde los parámetros de la ruta

  const possibleTags = ["genres", "modes", "themes", "others"]; // Tipos de tags permitidos
  try {
    if (!possibleTags.includes(tagsType)) {
      // Verificamos si el tipo de tags es válido si no coincide con los tipos permitidos error 400
      return res.status(400).json({ message: "Tags no válido" });
    }

    const user = await User.findById(userId);

    user.favoriteTags[tagsType] = user.favoriteTags[tagsType].filter(
      (t) => t !== tag
    ); // Filtramos los tags del usuario para eliminar el tag especificado en el body de la solicitud

    await user.save(); // Guardamos los cambios en la base de datos

    return res.status(200).json({
      message: "Tag eliminado correctamente",
      favoriteTags: user.favoriteTags,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar etiqueta", error });
  }
};

module.exports = {
  addTags,
  deleteTags,
};
