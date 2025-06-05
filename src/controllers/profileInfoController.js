const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { username, email,oldPassword, newPassword, avatar ,availability} = req.body;
       if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Email non valida" });
    }
    if (newPassword && !oldPassword) {
      return res.status(400).json({ message: "Devi inserire la vecchia password per cambiarla" });
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (availability) user.availability = availability;
    // If newPassword is provided, check oldPassword and hash newPassword
    if (newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Contraseña anterior incorrecta" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({
      message: "Perfil editado correctamente", user: { username, email, avatar },
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
