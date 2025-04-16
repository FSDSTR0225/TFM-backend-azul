const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

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
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
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

    // const userExist = await User.findOne({ $or:[ email? {email}: null,username? {username}:null].filter(Boolean)})
    // if (!userExist) {
    //     return res.status(404).json({ message: "Usuario o email inexistentes" });
    //   }

    // if (password !== userExist.password) {
    //   return res.status(401).json({ message: "Contraseña incorrecta" });
    // }

    const passwordMatch = await bcrypt.compare(password, userExist.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    return res.status(200).json({ message: "Sesión iniciada", userExist });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error inesperado del servidor", error });
  }
};

module.exports = { registerUser, loginUser };

// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Buscar usuario por email
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(404).json({ message: "Usuario no encontrado" });

//     // Comparar contraseñas
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: "Contraseña incorrecta" });

//     // Crear token JWT
//     const token = jwt.sign(
//       { id: user._id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.status(200).json({ message: "Inicio de sesión exitoso", user, token });
//   } catch (error) {
//     res.status(500).json({ message: "Error al iniciar sesión", error });
//   }
// };

// module.exports = {
//   registerUser,
//   loginUser,
// };

// const User = require("../models/User");

// const registerUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     User.findOne({ username });
//     if (username) {
//       return res
//         .status(400)
//         .json({ message: "El nombre de usuario ya existe" });
//     }
//     if (email) {
//       return res
//         .status(400)
//         .json({ message: "El correo electrónico ya existe" });
//     }
//     const newUser = new User({ username, email, password });
//     await newUser.save();
//     res.status(201).json({ message: "Usuario registrado", user: newUser });
//   } catch (error) {
//     res.status(500).json({ message: "Error al registrar el usuario", error });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       email: req.body.email,
//       username: req.body.username,
//       password: req.body.password,
//     });

//     if (!user)
//       return res.status(404).json({ message: "Usuario no encontrado" });
//     return res.status(200).json({ message: "Usuario encontrado", user });
//   } catch (error) {
//     return res.status(500).json({ message: "Error al iniciar sesión", error });
//   }
// };

// module.exports = {
//   registerUser,
//   loginUser,
// };
