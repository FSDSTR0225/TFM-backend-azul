require("dotenv").config();
const mongoose = require("mongoose");
const Game = require("../models/gameModel");
const Platform = require("../models/platformModel");

const API_KEY = process.env.RAWG_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

const startPage = 201;
const endPage = 250; // Cambio esto si queremos más páginas (200 primeras paginas exportadas)
const pageSize = 25;

async function importGames() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" Conectado a MongoDB");

    for (let page = startPage; page <= endPage; page++) {
      console.log(` Página ${page}...`);

      const res = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=${pageSize}&ordering=-added`
      );
      const data = await res.json();

      for (let i = 0; i < data.results.length; i++) {
        const game = data.results[i];

        // (iOS + Android → Mobile)
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
          rawgId: String(game.id),
          name: game.name,
          imageUrl: game.background_image,
          genres: game.genres.map((g) => g.name),
          platforms: platformIds,
          description: game.description_raw || game.description,
          screenshots: game.short_screenshots?.map((s) => s.image) || [],
          tags: game.tags?.map((t) => t.name) || [],
          background_image_additional: game.background_image_additional || null,
          clip: game.clip?.clip,
          released: game.released,
          stores: game.stores?.map((s) => s.store.name) || [],
          metacritic: game.metacritic,
          developers: game.developers?.map((d) => d.name) || [],
          esrbRating: data.esrb_rating?.name || null,
          lastImportedAt: new Date(),
        };

        await Game.updateOne({ rawgId: String(game.id) }, gameData, {
          upsert: true,
        });
        console.log(` Guardado: ${game.name}`);
      }
    }

    console.log(" Todos los juegos importados correctamente.");
    mongoose.disconnect();
  } catch (error) {
    console.error(" Error al importar juegos:", error.message);
    mongoose.disconnect();
  }
}

importGames();
