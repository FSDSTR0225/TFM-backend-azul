const express = require("express");
const router = express.Router();
const {
  createFriendRequest,
  getFriendRequestsReceived,
  getFriendRequestsSent,
  acceptFriendRequest,
  rejectFriendRequest,
} = require("../controllers/friendRequestController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/requests", verifyToken, createFriendRequest); // enviar solicitud de amistad
router.get("/requests/received", verifyToken, getFriendRequestsReceived); // obtener solicitudes de amistad recibidas
router.get("/requests/sent", verifyToken, getFriendRequestsSent); // obtener solicitudes de amistad enviadas
router.put("/requests/:requestId/accept", verifyToken, acceptFriendRequest); // aceptar solicitud de amistad
router.put("/requests/:requestId/reject", verifyToken, rejectFriendRequest); // rechazar solicitud de amistad (opcional, no implementado en el controlador)

module.exports = router;
