const Notification = require("../models/notificationModel");

const getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({ targetUser: req.user.id }).sort({
      createdAt: -1,
    });
    return res.json(notifs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al cargar notificaciones" });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { targetUser: req.user.id, read: false },
      { $set: { read: true } }
    );
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "No se pudieron marcar como leídas" });
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
};
