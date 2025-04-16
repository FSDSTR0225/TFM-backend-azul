const express = require("express");
const { getUsers,
     searchUsers,
    searchUsersByGames,
    searchUsersByPlatforms} = require("../controllers/userController");
const router = express.Router();

router.get("/", getUsers);
router.get('/search/:users', searchUsers);
router.get('/search/:games', searchUsersByGames);
router.get('/search/:platforms', searchUsersByPlatforms);

module.exports = router;