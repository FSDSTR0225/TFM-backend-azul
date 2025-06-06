const express = require("express");
const router = express.Router();
const {
  createFriendRequest,
  getFriendRequestsReceived,
  getFriendRequestsSent,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  deleteFriend,
  deleteMyFriendRequest,
} = require("../controllers/friendRequestController");
const verifyToken = require("../middlewares/verifyToken");


router.get("/", verifyToken, getFriends); //ver listado de amigos del usuario autenticado
router.post("/requests", verifyToken, createFriendRequest); // enviar solicitud de amistad
router.get("/requests/received", verifyToken, getFriendRequestsReceived); // obtener solicitudes de amistad recibidas
router.get("/requests/sent", verifyToken, getFriendRequestsSent); // obtener solicitudes de amistad enviadas
router.put("/requests/:requestId/accept", verifyToken, acceptFriendRequest); // aceptar solicitud de amistad
router.put("/requests/:requestId/reject", verifyToken, rejectFriendRequest); // rechazar solicitud de amistad (opcional, no implementado en el controlador)
router.delete("/:friendId", verifyToken, deleteFriend); //eliminar amigo
router.delete("/requests/:requestId", verifyToken, deleteMyFriendRequest); // eliminar solicitud de amistad enviada por el usuario autenticado

module.exports = router;
