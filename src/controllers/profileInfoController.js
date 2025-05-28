const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const editProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { username, email,oldPassword,   newPassword, avatar } = req.body;
    if (username) user.username = username;
    if (email) user.email = email;
    if (newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Contraseña anterior incorrecta" });
      }
      const password = newPassword;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (avatar) user.avatar = avatar;

    await user.save();
    res.status(200).json({
      message: "Perfil editado correctamente",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al editar el perfil", error: error.message });
  }
};

module.exports = {
  editProfile,
};
