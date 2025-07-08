const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");
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

router.post("/steam/link", verifyToken, (req, res) => {
  console.log("📥 Se está accediendo a la ruta POST /auth/steam/link");
  console.log("✅ Usuario autenticado (req.user):", req.user);

  // Guardamos el ID del usuario en la sesión para la autenticación con Steam
  req.session.link2playUserId = req.user.id;

  const redirectUrl = `https://tfm-backend-azul-h44j.onrender.com/auth/steam/start`;
  res.json({ redirectUrl });
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
