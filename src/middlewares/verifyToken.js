const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authToken = req.headers.authorization; //obtenemos el token del header de la peticion,el token se envia en el header de la peticion con el nombre de authorization

  if (!authToken) {
    return res.status(401).json({ message: "Token no proporcionado" }); //si no hay token devolvemos un error 401 que es de no autorizado
  }

  const token = authToken.split(" ")[1]; //el token se envia en el header con el formato Bearer token, por lo que tenemos que separar el token del Bearer con el metodo split que convierte un string en un array(el header Authorization viene como "Bearer n85f2fdbddfd3..."), y le decimos que queremos el segundo elemento del array(1), que es el token, el 0 es Bearer.[Bearer,token]

  if (!token) {
    return res.status(401).json({ message: "Token inválido" }); //si no hay token devolvemos un error 401 que es de no autorizado
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); //verificamos el token, el primer parametro es el token y el segundo es la clave secreta que usamos para firmar el token.

    req.user = decodedToken; //si el token es valido, guardamos el token decodificado en la peticion para el controller

    next(); // continuamos en controller
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token inválido o expirado", error: error.message }); //si el token no es valido devolvemos un error 401 que es de no autorizado
  }
};

module.exports = verifyToken;
