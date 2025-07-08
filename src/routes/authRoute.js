const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const passport = require("passport"); // importamos passport para la autenticación
const {
  registerUser,
  loginUser,
} = require("../controllers/registerAndLoginUsersController");

// Ruta para registrar un nuevo usuario
router.post("/register", registerUser);

// Ruta para hacer login (autenticación)
router.post("/login", loginUser);

router.post("/steam/link", (req, res) => {
  console.log("📥 Se está accediendo a la ruta POST /auth/steam/link");
  const rawHeader = req.headers.authorization;
  console.log("🔍 Token recibido en header Authorization:", rawHeader);
  const token = rawHeader?.split(" ")[1];
  console.log("🧪 Token extraído:", token);

  if (!token) {
    console.warn("⚠️ No se encontró token en la cabecera Authorization");
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decodificado correctamente:", decoded);

    req.session.link2playUserId = decoded.id;

    const redirectUrl = `https://tfm-backend-azul-h44j.onrender.com/auth/steam/start`;
    res.json({ redirectUrl });
  } catch (err) {
    console.error("Error al verificar token:", err.message);
    return res
      .status(401)
      .json({ error: "Token inválido", detail: err.message });
  }
});

router.get(
  "/steam/start",
  passport.authenticate("steam", { failureRedirect: "/" })
);

router.get(
  "/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173/lobby");
  }
);

module.exports = router;

// router.post("/steam/link", (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ error: "Token no proporcionado" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.session.link2playUserId = decoded.id;

//     const redirectUrl = `https://tfm-backend-azul-h44j.onrender.com/auth/steam/start`;
//     res.json({ redirectUrl });
//   } catch (err) {
//     return res.status(401).json({ error: "Token inválido" });
//   }
// });
