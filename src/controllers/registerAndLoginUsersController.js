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
<body style="margin:0;padding:0;font-family:'Audiowide','Segoe UI','Poppins',Arial,sans-serif;color:#fff;">
  <!-- Wrapper table (keeps email centred) background:#181c2b-->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
    <tr>
      <td align="center" style="padding:40px 12px;">
        <!-- Card container -->
        <div style="max-width:800px;border-radius:22px;overflow:hidden;background:linear-gradient(135deg,#0f0f0f,#1a1a2e);
                    box-shadow:0 0 32px #00ffc855,0 2px 12px #000a;">
          <!-- ========== HEADER ========== -->
          <div style="padding:44px 30px 30px 30px;text-align:center;">
            <img src="https://cdn-icons-png.flaticon.com/512/11914/11914271.png" width="84" style="margin-bottom:18px; background:linear-gradient(135deg,#0f0f0f,#1a1a2e); border-radius:50px; box-shadow:0 0 16px #00ffe7cc;">
            <h1 style="font-size:30px;color:#00ffe7;text-shadow:0 0 10px #00ffe6,0 0 2px #181a2a;
                       font-family:'Audiowide','Segoe UI',Arial,sans-serif;margin:0 0 10px;letter-spacing:1px;">
              ¡Bienvenido a Link2Play!
            </h1>
            <span style="display:inline-block;background:linear-gradient(90deg,#ffd700 60%,#ffb347 100%);color:#181a2a;
                         font-weight:bold;font-size:13px;border-radius:6px;padding:4px 16px;margin-bottom:20px;
                         box-shadow:0 0 8px #ffd70099;letter-spacing:1px;text-transform:uppercase;">
              🏆 LOGRO DESBLOQUEADO
            </span>
            <p style="font-size:18px;color:#fff;margin:0 0 14px 0;">
              ¡Hola <strong style="color:#00ffe7;">${username}</strong>!<br>Tu cuenta ha sido creada con éxito.
            </p>
            <p style="font-size:16px;color:#b2f7ef;margin:0 0 26px 0;line-height:1.45;">Ya estás listo para comenzar:</p>
            <ul style="list-style:none;margin:0 0 34px 0;padding:0;font-size:16px;color:#b2f7ef;line-height:1.6;text-align:left;max-width:320px;display:inline-block;">
             <li style="margin:0;">• Personaliza tu perfil gamer.</li>  
            <li style="margin:0;">• Organiza o únete a partidas.</li>
              <li style="margin:0;">• Explora nuestra IA y descubre juegos o jugadores afines a ti.</li>
              <li style="margin:0;">• Forma tu squad y vive la experiencia <strong style="color:#00ffe7;">Link2Play</strong>.</li>
            </ul>
            <br>
            <a href="https://link2play.com/login" target="_blank"
               style="display:inline-block;padding:15px 38px;background:linear-gradient(90deg,#00ffe7 60%,#66fcf1 100%);
                      color:#181a2a;border-radius:32px;text-decoration:none;font-weight:bold;font-size:18px;
                      letter-spacing:1px;box-shadow:0 0 16px #00ffe7cc,0 0 8px #00ffc8cc;">ENTRAR A LINK2PLAY</a>
          </div>

          <!-- ========== HUD GAMER ========== -->
          <div style="padding:0 30px 34px 30px;text-align:center;">
            <div style="font-size:18px;color:#66fcf1;font-family:'Audiowide',Arial,sans-serif;margin:26px 0 16px 0;letter-spacing:1px;">HUD GAMER</div>
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%" style="max-width:460px;margin:0 auto;">
              <tr>
                <td width="30%" align="center" style="padding:10px;min-height:130px; height:130px; vertical-align:top;">
                  <img src="https://cdn-icons-png.flaticon.com/512/2029/2029518.png" width="56" height="56" alt="Perfil Gamer" style="display:block;background:#00ffc8;border-radius:12px;box-shadow:0 0 8px #00ffc8cc;">
                  <p style="font-size:13px;color:#00ffc8;margin:8px 0 0;font-weight:bold;">Perfil<br>Gamer</p>
                </td>
                <td width="30%" align="center" style="padding:10px;min-height:130px; height:130px; vertical-align:top;">
                  <img src="https://cdn-icons-png.flaticon.com/512/7037/7037281.png" width="56" height="56" alt="Crea Eventos" style="display:block;background:#ffd000;border-radius:12px;box-shadow:0 0 8px #ffd000cc;">
                  <p style="font-size:13px;color:#ffd000;margin:8px 0 0;font-weight:bold;">Crea<br>Eventos</p>
                </td>
                <td width="30%" align="center" style="padding:10px;min-height:130px; height:130px; vertical-align:top;">
                  <img src="https://cdn-icons-png.flaticon.com/512/4533/4533718.png" width="56" height="56" alt="Juega" style="display:block;background:#b96bff;border-radius:12px;box-shadow:0 0 8px #b96bffcc;">
                  <p style="font-size:13px;color:#b96bff;margin:8px 0 0;font-weight:bold;">Juega</p>
                </td>
                <td width="30%" align="center" style="padding:10px;min-height:130px; height:130px; vertical-align:top;">
                  <img src="https://cdn-icons-png.flaticon.com/512/2822/2822379.png" width="56" height="56" alt="Explora Juegos" style="display:block;background:#00a9ff;border-radius:12px;box-shadow:0 0 8px #00a9ffcc;">
                  <p style="font-size:13px;color:#00a9ff;margin:8px 0 0;font-weight:bold;">Explora<br>Juegos</p>
                </td>
              </tr>
            </table>
            <div style="margin-top:20px;">
              <div style="width:180px;height:12px;background:#23243a;border-radius:7px;margin:0 auto;">
                <div style="width:70%;height:100%;background:linear-gradient(90deg,#00ffc8 0%,#ffd700 100%);border-radius:7px;"></div>
              </div>
              <div style="font-size:12px;color:#888;margin-top:7px;letter-spacing:0.5px;">Progreso inicial del jugador</div>
            </div>
            <hr style="border:none;border-top:1.5px solid #00ffc822;margin:32px 0 20px 0;">
            <div style="font-family:'Audiowide',Arial,sans-serif;font-size:16px;color:#66fcf1;margin-bottom:18px;">
              🏆 ¡Logro desbloqueado! <span style="color:#ffd700;">Primer login</span>
            </div>
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
              <tr>
                <td style="padding:0 8px;"><a href="https://twitter.com/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" width="28" alt="Twitter" style="display:block;border-radius:6px;box-shadow:0 0 8px #00ffc8cc;"></a></td>
                <td style="padding:0 8px;"><a href="https://discord.com/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png" width="28" alt="Discord" style="display:block;border-radius:6px;box-shadow:0 0 8px #00ffc8cc;"></a></td>
                <td style="padding:0 8px;"><a href="https://twitch.tv/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111668.png" width="28" alt="Twitch" style="display:block;border-radius:6px;box-shadow:0 0 8px #00ffc8cc;"></a></td>
              </tr>
            </table>
            <div style="font-size:12px;color:#888;margin:26px 0 0 0;"><span style="font-size:15px;color:#00ffc8;">Link2Play</span> © 2025 | Powered by gamers for gamers</div>
            <p style="font-size:12px;color:#888;margin:14px 0 0 0;">¿No fuiste tú? Ignora este correo.</p>
          </div>
        </div><!-- /card -->
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
