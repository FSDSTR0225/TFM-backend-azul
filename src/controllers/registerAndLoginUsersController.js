const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor complete todos los campos" });
    }
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(409).json({
        message: "El nombre de usuario o correo electrónico ya existe",
      });
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      // password: hashedPassword,
      password: password,
    });
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        password: user.password,
      },
      process.env.JWT_SECRET
    );
    return res.status(201).json({
      accessTdoken: token,
      token_type: "Bearer",
      message: "Usuario registrado correctamente",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al registrar el usuario", error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res
        .status(400)
        .json({ message: "Por favor complete todos los campos" });
    }
    const isEmail = await login.includes("@");
    const condition = isEmail ? { email: login } : { username: login };

    const userExist = await User.findOne(condition);
    if (!userExist) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // const passwordMatch = await bcrypt.compare(password, userExist.password);

    // if (!passwordMatch) {
    if (!password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      {
        username: userExist.username,
        email: userExist.email,
        favoriteGames: userExist.favoriteGames,
        platforms: userExist.platforms,
      },
      process.env.JWT_SECRET
    );
    return res
      .status(200)
      .json({ access_token: token, token_type: "Bearer", userExist });

    // return res.status(200).json({ message: "Sesión iniciada", userExist });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error inesperado del servidor", error });
  }
};
const getMe = async (req, res) => {
  try {
    const secretKey = process.env.JWT_SECRET;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const decoded = jwt.verify(token, secretKey);

    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "user identified correctly", user: user });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { registerUser, loginUser, getMe };
