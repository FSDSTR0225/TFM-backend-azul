const express = require("express");
const router = express.Router();

const {
  getSteamStats,
  getLibrarySummary,
  getGenreStats,
  getRecentActivity,
} = require("../controllers/steamStatsController");

router.get("/stats/:steamId", getSteamStats);
router.get("/stats/:steamId/summary", getLibrarySummary);
router.get("/stats/:steamId/genres", getGenreStats);
router.get("/stats/:steamId/recent", getRecentActivity);

module.exports = router;
