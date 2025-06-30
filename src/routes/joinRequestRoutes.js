const express = require("express");
const router = express.Router();
const {
  getJoinRequests,
  acceptOrRejectJoinRequest,
  getMyJoinRequests,
  deleteMyRequest,
  getRequestsToMyEvents,
} = require("../controllers/joinRequestController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/requests", verifyToken, acceptOrRejectJoinRequest); // Aceptar o rechazar solicitudes de unirse a un evento especifico MIO
router.get("/my-requests", verifyToken, getMyJoinRequests); // Obtener mis solicitudes de unirse a eventos hechas por mi (todas las solicitudes que he hecho)
router.get("/my-events/requests", verifyToken, getRequestsToMyEvents); // Obtener todas las solicitudes de unirse a eventos creados por mi recibidas,que otros han hecho a mis eventos
router.delete("/requests/:requestId", verifyToken, deleteMyRequest); // Eliminar una solicitud de unirse a un evento hecha por mi
router.get("/:eventId/requests", verifyToken, getJoinRequests); // Obtener solicitudes de unirse a un evento en especifico(mio,yo soy el creador del evento)

module.exports = router;
