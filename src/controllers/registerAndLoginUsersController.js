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
    const userExists = await User.findOne({ $or: [{ email }, { username }] }); // buscamos si usuario o email ya existen con el operador $or que es de mongo y permite buscar por varios campos a la vez
    if (userExists) {
      return res.status(409).json({
        //usamos el status 409 que es para conflictos,en este caso si el usuario o email ya existen
        message: "El nombre de usuario o correo electrónico ya existe",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // encriptamos la contraseña con bcrypt, el segundo parametro es el numero de veces que se encripta la contraseña, entre mas alto sea el numero mas seguro es pero mas lento es el proceso de encriptacion.

    // creamos el user con create de mongoose, y lo guardamos en la base de datos.
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // firmamos el token con la libreria jsonwebtoken,jwt.sign se usa para crear/firmar un token,
    // el primer parametro es el payload (los datos que queremos enviar en el token),
    // el segundo parametro es la clave secreta que usamos para firmar el token (process.env.JWT_SECRET)
    // y el tercer parametro son las opciones del token, en este caso le decimos que expire en 1 dia(expiresIn: "1d" ).

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //respuesta con el token,bearer es el tipo de token que estamos usando, y el mensaje de exito,ademas de los datos del usuario que acabamos de crear.
    return res.status(201).json({
      access_token: token,
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
    const { login, password } = req.body; // definimos login como campor username o email y password como la contraseña
    if (!login || !password) {
      return res
        .status(400)
        .json({ message: "Por favor complete todos los campos" });
    }

    const isEmail = await login.includes("@"); //creamos la variable isEmail que busca si el login incluye el simbolo @
    const condition = isEmail ? { email: login } : { username: login }; // y creamos la variable condition que busca si isEmail es true,es decir si isEmail incluye el simbolo @,entonces busca por email, si no busca por username.

    const userExist = await User.findOne(condition).select("+password"); //buscamos si el usuario existe en la base de datos,con findOne le pasamos condition que es el objeto que contiene el email o username, y si no existe error 404, el .select("+password") es para que nos devuelva la contraseña encriptada,
    // ya que por defecto no la devuelve por seguridad y asi podemos compararla con la contraseña que nos mandan.
    if (!userExist) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const passwordMatch = await bcrypt.compare(password, userExist.password); // comparamos la constraseña que nos mandan con la contraseña que tenemos en la base de datos,con bcrypt.compare, el primer parametro es la contraseña que nos mandan y el segundo es la contraseña que tenemos en la base de datos.

    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" }); // si no coinciden las contraseñas,error 401 que es no autorizado.
    }

    //firmamos el token y lo enviamos al cliente, el primer parametro es el payload (los datos que queremos enviar en el token), el segundo parametro es la clave secreta que usamos para firmar el token (process.env.JWT_SECRET) y el tercer parametro son las opciones del token, en este caso le decimos que expire en 1 dia(expiresIn: "1d" ).
    const token = jwt.sign(
      {
        id: userExist._id,
        username: userExist.username,
        email: userExist.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //respuesta con el token,bearer es el tipo de token que estamos usando, y el mensaje de exito,ademas de los datos del usuario que acabamos de crear.
    return res.status(200).json({
      access_token: token,
      token_type: "Bearer",
      user: {
        id: userExist._id,
        username: userExist.username,
        email: userExist.email,
      },
    });

    // return res.status(200).json({ message: "Sesión iniciada", userExist });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error inesperado del servidor", error });
  }
};

module.exports = { registerUser, loginUser };
