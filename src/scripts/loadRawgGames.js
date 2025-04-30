require("dotenv").config();
const mongoose = require("mongoose");
const Game = require("../models/gameModel");
const Platform = require("../models/platformModel");

// Configuración
const API_KEY = process.env.RAWG_API_KEY;
const MONGO_URI = process.env.MONGO_URI;
const RAWG_API_URL = "https://api.rawg.io/api/games";

const startPage = 1;
const endPage = 5; // Cambia esto si quieres más páginas
const pageSize = 25;

async function importGames() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    for (let page = startPage; page <= endPage; page++) {
      console.log(`➡️ Página ${page}...`);

      const res = await fetch(
        `${RAWG_API_URL}?key=${API_KEY}&page=${page}&page_size=${pageSize}`
      );
      const data = await res.json();

      for (let i = 0; i < data.results.length; i++) {
        const game = data.results[i];

        // Normalizar slugs (iOS + Android → Mobile)
        const slugs = game.platforms.map((p) => {
          const slug = p.platform.slug;
          return slug === "ios" || slug === "android" ? "mobile" : slug;
        });

        // Buscar las plataformas en la base de datos
        const platformDocs = await Platform.find({
          slug: { $in: slugs },
        }).select("_id");
        const platformIds = platformDocs.map((p) => p._id);

        // Crear o actualizar el juego
        const gameData = {
          rawgId: game.id,
          name: game.name,
          imageUrl: game.background_image,
          genres: game.genres.map((g) => g.name),
          platforms: platformIds,
          released: game.released,
          rating: game.rating,
          lastImportedAt: new Date(),
        };

        await Game.updateOne({ rawgId: game.id }, gameData, { upsert: true });
        console.log(`🎮 Guardado: ${game.name}`);
      }
    }

    console.log("✅ Todos los juegos importados correctamente.");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error al importar juegos:", error.message);
    mongoose.disconnect();
  }
}

importGames();
