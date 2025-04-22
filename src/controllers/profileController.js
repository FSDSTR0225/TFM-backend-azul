const { validationResult } = require("express-validator");
const User = require("../models/userModel");

// Ver perfil
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.status(200).json({
      nombre: user.nombre,
      email: user.email,
      juegosFavoritos: user.juegosFavoritos,
      plataformas: user.plataformas,
      horarios: user.horarios,
      avatarUrl: user.avatarUrl,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error interno al consultar el perfil." });
  }
};

// Actualizar perfil
const updateProfile = async (req, res) => {
  const { email, nombre, juegosFavoritos, plataformas, disponibilidadHoraria } =
    req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { email, nombre, juegosFavoritos, plataformas, disponibilidadHoraria },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    updatedUser.password = undefined;

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar el perfil" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
