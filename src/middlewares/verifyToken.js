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

    req.userId = decodedToken.id; // <--- Aquí guardamos el ID del usuario
    // opcional: también puedes guardar el objeto completo si lo necesitas
    // req.user = decodedToken;

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token inválido o expirado", error: error.message });
  }
};

module.exports = verifyToken;
