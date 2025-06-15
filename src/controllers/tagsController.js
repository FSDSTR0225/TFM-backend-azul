const User = require("../models/userModel");

const updateTags = async (req, res) => {
  try {
    const userId = req.user.id;
    const { favoriteTags } = req.body;

    if (!favoriteTags) {
      return res
        .status(400)
        .json({ message: "No se enviaron tags para actualizar." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.favoriteTags = favoriteTags;
    await user.save();

    res.status(200).json({
      message: "Tags actualizados correctamente",
      favoriteTags: user.favoriteTags,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar los tags", error: error.message });
  }
};

module.exports = {
  updateTags,
};
