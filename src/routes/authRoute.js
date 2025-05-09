const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
} = require("../controllers/registerAndLoginUsersController");

// Ruta para registrar un nuevo usuario
router.post("/register", registerUser);

// Ruta para hacer login (autenticación)
router.post("/login", loginUser);

module.exports = router;
