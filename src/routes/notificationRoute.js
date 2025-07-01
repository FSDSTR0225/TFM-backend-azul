const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  getNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");

router.get("/", verifyToken, getNotifications); // Obtener notificaciones del usuario autenticado
router.patch("/reads", verifyToken, markNotificationAsRead); // Marcar todas las notificaciones como leidas del usuario autenticado

module.exports = router;
