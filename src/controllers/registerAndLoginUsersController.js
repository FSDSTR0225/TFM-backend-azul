const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mail");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor complete todos los campos" });
    }

    const cleanUsername = username.trim();
    const usernameLower = cleanUsername.toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({
      $or: [{ email: cleanEmail }, { usernameLower: usernameLower }],
    }); // buscamos si usuario o email ya existen con el operador $or que es de mongo y permite buscar por varios campos a la vez
    console.log("userExists", userExists);

    if (userExists) {
      return res.status(409).json({
        //usamos el status 409 que es para conflictos,en este caso si el usuario o email ya existen
        message: "El nombre de usuario o correo electrónico ya existe",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // encriptamos la contraseña con bcrypt, el segundo parametro es el numero de veces que se encripta la contraseña, entre mas alto sea el numero mas seguro es pero mas lento es el proceso de encriptacion.

    // creamos el user con create de mongoose, y lo guardamos en la base de datos.
    const user = await User.create({
      username: cleanUsername,
      usernameLower: usernameLower,
      email: cleanEmail,
      password: hashedPassword,
    });

    console.log("Usuario creado:", user);
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

    console.log("Token generado:", token);

    try {
      await transporter.sendMail({
        from: '"Link2Play" <tfmazul@gmail.com>',
        to: user.email,
        subject: "Bienvenido a Link2Play",
        text: `Hola ${username}, gracias por registrarte en Link2Play. ¡Que empiece la aventura!`,
        html: `
  <body style="margin:0; padding:0; background:linear-gradient(135deg,#0f0f0f,#1a1a2e); font-family: 'Segoe UI', sans-serif; color: #fff;">
    <table align="center" width="100%" style="max-width: 600px; background: rgba(255,255,255,0.05); border-radius: 12px; backdrop-filter: blur(8px); box-shadow: 0 0 12px rgba(0,255,255,0.2); margin-top: 40px; padding: 30px;">
      <tr>
        <td align="center">
          <img src="https://cdn-icons-png.flaticon.com/512/3791/3791503.png" width="80" style="margin-bottom: 20px;" alt="Link2Play Logo" />
          <h1 style="font-size: 26px; color: #00ffe7; text-shadow: 0 0 5px #00ffe7;">¡Bienvenido a Link2Play!</h1>
          <p style="font-size: 16px; color: #ccc;">Bien hecho <strong style="color:#00ffe7;">${username}</strong>, tu cuenta ha sido creada con éxito. </p>
          <br />
          <p style="font-size: 16px; color: #ccc;">¡Comienza tu aventura! Ya puedes organizar y unirte a partidas, conocer jugadores, formar tu squad y disfrutar de la comunidad Link2Play 🎮</p>
          <a href="https://link2play.com/login" target="_blank"
            style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #00ffe7; color: #0f0f0f; border-radius: 30px; text-decoration: none; font-weight: bold; text-shadow: none; box-shadow: 0 0 8px #00ffe7;">
            ENTRAR A LINK2PLAY
          </a>
          <div style="margin-top: 30px;">
            <p style="font-size: 13px; color: #888;">¿No fuiste tú? Ignora este correo.</p>
          </div>
        </td>
      </tr>
    </table>
  </body>
`,
      });
      console.log("Correo enviado correctamente");
    } catch (mailError) {
      console.error("Error al enviar el correo:", mailError.message);
      // opcional: continuar sin romper el flujo
    }

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
    const isEmail = login.includes("@"); //creamos la variable isEmail que busca si el login incluye el simbolo @
    const condition = isEmail
      ? { email: login.trim().toLowerCase() }
      : { usernameLower: login.trim().toLowerCase() }; // y creamos la variable condition que busca si isEmail es true,es decir si isEmail incluye el simbolo @,entonces busca por email, si no busca por usernameLower (para ignorar mayús/minús)
    //usernameLower es un campo que creamos en el modelo de usuario para guardar el username en minúsculas y así poder buscarlo sin importar si el usuario escribe mayúsculas o minúsculas.

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
