const User = require("../models/userModel");

const addFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendsId = req.body.friendsIds;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!friendsId || friendsId.length === 0) {
      return res.status(400).json({ message: "Debe añadir al menos un amigo" });
    }

    const friendsToAdd = friendsId.filter(
      (id) => !user.friends.some((f) => f.equals(id))
    );

    user.friends.push(...friendsToAdd);
    await user.save();

    return res.status(200).json({
      message: `Se añadieron ${friendsToAdd.length} amigo(s)`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al añadir amigos",
      error: error.message,
    });
  }
};

const deleteFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.friends = user.friends.filter((fId) => fId.toString() !== friendId);

    await user.save();

    return res.status(200).json({
      message: "Amigo eliminado correctamente",
      friendId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el amigo",
      error: error.message,
    });
  }
};

const getOnlineFriends = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).populate(
      "friends.user",
      "username avatar onlineStatus"
    );
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const onlineFriends = user.friends.filter(
      (friend) => friend.user && friend.user.onlineStatus === true
    );

    return res.status(200).json({
      onlineFriends: onlineFriends.map((friend) => ({
        id: friend.user._id,
        username: friend.user.username,
        avatar: friend.user.avatar,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener amigos en línea",
      error: error.message,
    });
  }
};

module.exports = {
  addFriend,
  deleteFriend,
  getOnlineFriends,
};
