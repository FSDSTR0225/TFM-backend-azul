const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authToken.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token inválido" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken; // Almacenamos la información del usuario decodificada en el objeto req para que esté disponible en las siguientes funciones de middleware o controladores.

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token inválido o expirado", error: error.message });
  }
};

module.exports = verifyToken;
