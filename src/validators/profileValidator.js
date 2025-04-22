const { body } = require("express-validator");

const profileValidator = [
  body("email").isEmail().withMessage("El email debe ser válido").optional(),
  body("nombre")
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .optional(),
  body("juegosFavoritos")
    .isArray()
    .withMessage("Los juegos favoritos deben ser una lista")
    .optional(),
  body("plataformas")
    .isArray()
    .withMessage("Las plataformas deben ser una lista")
    .optional(),
  body("disponibilidadHoraria")
    .isString()
    .withMessage("La disponibilidad horaria debe ser una cadena de texto")
    .optional(),
];

module.exports = profileValidator;
