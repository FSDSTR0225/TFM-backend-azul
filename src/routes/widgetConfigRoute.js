const express = require("express");
const router = express.Router();
const {
  getWidgetConfig,
  updateWidget,
  addWidget,
  deleteWidget,
  updateMultiWidgets,
} = require("../controllers/widgetConfigController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getWidgetConfig); // Obtener la configuración de widgets del usuario autenticado
router.put("/multi-update", verifyToken, updateMultiWidgets); // Actualizar múltiples widgets de la configuración del usuario autenticado
router.post("/:widgetType", verifyToken, addWidget); // Añadir un nuevo widget a la configuración del usuario autenticado
router.put("/:widgetId", verifyToken, updateWidget); // Actualizar la configuración de widgets del usuario autenticado
router.delete("/:widgetId", verifyToken, deleteWidget); // Eliminar un widget específico de la configuración del usuario autenticado

module.exports = router;
