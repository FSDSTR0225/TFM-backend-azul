require("dotenv").config();
const mongoose = require("mongoose");
const Game = require("../models/gameModel");
const Platform = require("../models/platformModel");

const API_KEY = process.env.RAWG_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

const startPage = 1;
const endPage = 100; // Cambio esto si queremos más páginas (200 primeras paginas exportadas)
const pageSize = 25;

async function importGames() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" Conectado a MongoDB");

    let guardados = 0;
    let fallos = 0;

    for (let page = startPage; page <= endPage; page++) {
      console.log(` Página ${page}...`);

      const res = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=${pageSize}&ordering=-added&lang=es`
      );
      const data = await res.json();

      for (let i = 0; i < data.results.length; i++) {
        try {
          const game = data.results[i];

          const detailsRes = await fetch(
            `https://api.rawg.io/api/games/${game.id}?key=${API_KEY}&lang=es`
          );
          const detailsData = await detailsRes.json();

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
            // description: game.description_raw || game.description,
            description: detailsData.description_raw || detailsData.description,
            screenshots: game.short_screenshots?.map((s) => s.image) || [],
            tags: game.tags?.map((t) => t.name) || [],
            background_image_additional:
              game.background_image_additional || null,
            clip: game.clip?.clip,
            released: game.released,
            stores: game.stores?.map((s) => s.store.name) || [],
            metacritic: game.metacritic,
            developers: detailsData.developers?.map((d) => d.name) || [],
            esrbRating: detailsData.esrb_rating?.name || null,
            lastImportedAt: new Date(),
          };

          await Game.updateOne({ rawgId: String(game.id) }, gameData, {
            upsert: true,
          });
          guardados++;
          console.log(` Guardado: ${game.name}`);
        } catch (error) {
          fallos++;
          console.error(
            ` Error con el juego ${
              data.results[i]?.name || `ID: ${data.results[i]?.id}`
            }: ${error.message}`
          );
        }
      }
    }

    console.log(" Todos los juegos importados correctamente.");
    console.log(`\n✅ Juegos guardados correctamente: ${guardados}`);
    console.log(`⚠️ Juegos con error: ${fallos}`);
    mongoose.disconnect();
  } catch (error) {
    console.error(" Error al importar juegos:", error.message);
    mongoose.disconnect();
  }
}

importGames();
