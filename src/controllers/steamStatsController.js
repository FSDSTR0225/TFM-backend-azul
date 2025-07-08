const User = require("../models/userModel");
const Game = require("../models/gameModel");

// Obtiene logros para un juego
async function fetchAchievements(steamId, appId, apiKey) {
  try {
    const res = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${apiKey}&steamid=${steamId}&appid=${appId}`
    );
    const json = await res.json();
    const ach = json?.playerstats?.achievements;
    if (!ach || ach.length === 0)
      return { unlocked: 0, total: 0, percent: null };
    const unlocked = ach.filter((a) => a.achieved === 1).length;
    const total = ach.length;
    return { unlocked, total, percent: Math.round((unlocked / total) * 100) };
  } catch {
    return { unlocked: 0, total: 0, percent: null };
  }
}

const getSteamStats = async (req, res) => {
  try {
    const steamId = req.params.steamId;
    if (!steamId)
      return res.status(400).json({ message: "Steam ID no válido" });
    const apiKey = process.env.STEAM_API_KEY;

    // Trae los juegos jugados
    const resp = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`
    );
    const json = await resp.json();
    const allGames = json?.response?.games || [];

    // Top 5 por tiempo jugado
    const top5 = allGames
      .sort((a, b) => b.playtime_forever - a.playtime_forever)
      .slice(0, 5);

    // Enriquecer con logros
    const games = await Promise.all(
      top5.map(async (g) => {
        const { unlocked, total, percent } = await fetchAchievements(
          steamId,
          g.appid,
          apiKey
        );
        return {
          appId: g.appid,
          name: g.name,
          playtimeHours: Math.round(g.playtime_forever / 60),
          lastPlayed: g.rtime_last_played
            ? new Date(g.rtime_last_played * 1000).toLocaleDateString()
            : null,
          logoUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
          steamStoreUrl: `https://store.steampowered.com/app/${g.appid}`,
          unlocked,
          total,
          percent,
        };
      })
    );
    console.log(games);
    return res.status(200).json({ games });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getLibrarySummary = async (req, res) => {
  try {
    const steamId = req.params.steamId;
    if (!steamId) {
      return res.status(400).json({ message: "Steam ID no válido" });
    }
    const apiKey = process.env.STEAM_API_KEY;

    // 1) Obtener todos los juegos jugados
    const resp = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/` +
        `?key=${apiKey}&steamid=${steamId}` +
        `&include_appinfo=true&include_played_free_games=true`
    );
    const json = await resp.json();
    const games = json?.response?.games || [];

    // 2) Calcular totales
    const totalGames = games.length;
    const totalMinutes = games.reduce(
      (sum, g) => sum + (g.playtime_forever || 0),
      0
    );
    const totalHours = Math.round(totalMinutes / 60);

    // 3) Preparar array de horas por juego
    const hoursPerGame = games.map((g) => ({
      appId: g.appid,
      name: g.name,
      hours: Math.round((g.playtime_forever || 0) / 60),
    }));

    return res.status(200).json({ totalGames, totalHours, hoursPerGame });
  } catch (err) {
    console.error("❌ getLibrarySummary:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getGenreStats = async (req, res) => {
  try {
    const steamId = req.params.steamId;
    if (!steamId) {
      return res.status(400).json({ message: "Steam ID no válido" });
    }
    const apiKey = process.env.STEAM_API_KEY;

    // 1) Traer la lista completa de juegos jugados
    const resp = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/` +
        `?key=${apiKey}&steamid=${steamId}` +
        `&include_appinfo=true&include_played_free_games=true`
    );

    // obtenemos todos lo juegos que tiene el usuario y sys horas jugadas
    const json = await resp.json();
    const owned = json?.response?.games || [];

    if (owned.length === 0) {
      return res.status(200).json({ genres: [] });
    }

    // 2) Extraer los nombres tal cual vienen de Steam
    const steamNames = owned.map((g) => g.name);

    // 3) Buscar en tu DB los juegos cuyos nombres coincidan
    //    (asegúrate de tener un índice por name o nameLower)
    const dbGames = await Game.find({
      name: { $in: steamNames },
    }).select("name genres");

    // 4) Acumular count + horas por género
    const genreMap = {};
    dbGames.forEach((g) => {
      // encontrar su entrada en 'owned' para sumar horas
      const played = owned.find((o) => o.name === g.name);
      const minutes = played?.playtime_forever || 0;
      const hours = Math.round(minutes / 60);

      (g.genres || []).forEach((genre) => {
        if (!genreMap[genre]) {
          genreMap[genre] = { count: 0, hours: 0 };
        }
        genreMap[genre].count += 1;
        genreMap[genre].hours += hours;
      });
    });

    // 5) Convertir a array y quedarnos con el top 5 por número de juegos
    const genres = Object.entries(genreMap)
      .map(([genre, stats]) => ({
        genre,
        count: stats.count,
        hours: stats.hours,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // para limitar a los 5 géneros más jugados

    console.log("🎮 Juegos totales en Steam:", owned.length);
    console.log("🎯 Juegos encontrados en DB:", dbGames.length);
    console.log("📊 Géneros procesados:", Object.keys(genreMap).length);

    return res.status(200).json({ genres });
  } catch (err) {
    console.error("❌ getGenreStats:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const steamId = req.params.steamId;
    if (!steamId) {
      return res.status(400).json({ message: "Steam ID no válido" });
    }
    const apiKey = process.env.STEAM_API_KEY;

    // 1) Pedir lista de juegos
    const resp = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/` +
        `?key=${apiKey}&steamid=${steamId}` +
        `&include_appinfo=true&include_played_free_games=true`
    );
    const json = await resp.json();
    const games = json?.response?.games || [];

    // 2) Filtrar los jugados en los últimos 7 días
    const oneWeekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;
    const recent = games
      .filter((g) => g.rtime_last_played >= oneWeekAgo)
      .map((g) => ({
        appId: g.appid,
        name: g.name,
        lastPlayed: new Date(g.rtime_last_played * 1000).toLocaleDateString(),
        hours: Math.round((g.playtime_forever || 0) / 60),
      }));

    return res.status(200).json({ recent });
  } catch (err) {
    console.error("❌ getRecentActivity:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  getSteamStats,
  getLibrarySummary,
  getGenreStats,
  getRecentActivity,
};
