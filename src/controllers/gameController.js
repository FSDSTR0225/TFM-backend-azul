require("dotenv").config();
const Game = require("../models/gameModel");
const Platform = require("../models/platformModel");

const API_KEY = process.env.RAWG_API_KEY;

const getGames = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Capturamos la pagina que viene por query, si no viene nada o viene mal,por defecto será la 1.
  const pageSize = 25;

  try {
    // Paso 1: Intentar obtener juegos desde Mongo
    const gamesFromMongo = await Game.find()
      // .sort({ name: 1 }) // Obtenemos los juegos por paginacion, usamos sort para ordenarlos por orden alfabético(1 = orden ascendente de A a Z),
      .skip((page - 1) * pageSize) // usamos skip para la paginacion y que sepa que juegos skipear(saltar), (Ej si estamos en pagina 2,page=2 serian (2-1)*25 = 25,se omitirian los primeros 25 juegos)
      .limit(pageSize); // por ultimo limit - limita los juegos a lo marcado en la const pageSize.

    // Si hay juegos en Mongo, devolverlos
    if (gamesFromMongo.length > 0) {
      return res.status(200).json(gamesFromMongo);
    }

    // Si no hay juegos en Mongo para esta página, llamar a RAWG en el mismo orden que en Mongo(paginación y orden alfabético)
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=${pageSize}&ordering=-added&`
    );

    if (!response.ok) {
      throw new Error("Error fetching games from RAWG");
    }

    const data = await response.json();

    const gamesReady = []; // Creamos un array para guardar los juegos con los datos que queremos obtener de la api y que vamos a guardar en mongo.

    //  creamos un bucle para recorrer los juegos obtenidos de la api y guardarlos en mongo si no existen ya.
    //  y si existen los actualizamos con los datos que queremos obtener de la api.
    for (let i = 0; i < data.results.length; i++) {
      const game = data.results[i];

      // iOs + Android seran "mobile"
      // Obtenemos los slugs de las plataformas y transformamos iOS y Android a "mobile" para que coincidan con la base de datos

      const slugs = game.platforms.map((plat) => {
        const slug = plat.platform.slug;
        return slug === "ios" || slug === "android" ? "mobile" : slug;
      });

      const platformInMongo = await Platform.find({
        slug: { $in: slugs },
      }).select("_id"); // Buscamos las plataformas en la base de datos usando el slug, y solo seleccionamos el id.
      const platformIds = platformInMongo.map((platform) => platform._id); // Obtenemos los ids de las plataformas que coinciden con los slugs obtenidos anteriormente y los guardamos en un array para asignarlos al juego.

      const gameData = {
        rawgId: String(game.id),
        name: game.name,
        imageUrl: game.background_image,
        genres: game.genres.map((g) => g.name),
        platforms: platformIds,
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
      gamesReady.push(gameData); // Guardamos el juego depurado con los datos que queriamos obtenidos de la api(gameData) en un array para devolverlo al final.
    }

    return res.status(200).json(gamesReady); // Devolvemos los juegos depurados por lo que queriamos obtener de la api y guardados en mongo.
  } catch (error) {
    console.error("Error en getGames:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getGameById = async (req, res) => {
  const { id } = req.params; // Obtenemos el id del juego de la url
  try {
    const gameFromMongo = await Game.findOne({ rawgId: id }).populate(
      "platforms",
      "name slug"
    ); // Buscamos el juego por su RawgId en la base de datos (juegos cuya rawgId=Id de url),y no buscamos por findById porque no buscamos _.id de mongo sino la rawgId ya almacenada, y con el populate llenamos la propiedad platforms con el nombre y slug de la plataforma(no solo el id de la paltaforma que devolveria el juego).

    // Si el juego existe en la base de datos, lo devolvemos.
    // Si no existe en la base de datos, buscamos por id de mongo, ya que puede que el juego no tenga rawgId pero si id de mongo.
    if (!gameFromMongo && mongoose.Types.ObjectId.isValid(id)) {
      gameFromMongo = await Game.findById(id).populate(
        "platforms",
        "name slug"
      );
    }

    // Comprobamos si el juego necesita ser actualizado,
    // si no existe o si no tiene descripcion o desarrolladores o esrbRating.
    const needsUpdate =
      !gameFromMongo ||
      !gameFromMongo.description ||
      !gameFromMongo.developers?.length ||
      !gameFromMongo.esrbRating;

    if (!needsUpdate) {
      return res.status(200).json(gameFromMongo); // Si el juego existe en la base de datos y no necesita ser actualizado, lo devolvemos de ahi.
    }

    const response = await fetch(
      `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
    ); // Si no existe en la base de datos, lo buscamos en la API de RAWG.

    if (!response.ok) {
      throw new Error("Error fetching game from RAWG"); // Si la respuesta no es ok, lanzamos un error.
    }

    const data = await response.json(); // Si la respuesta es ok, la convertimos a json.

    let screenshots = gameFromMongo?.screenshots; // Si el juego existe en la base de datos, guardamos sus capturas de pantalla en un array.

    // Si no existen capturas de pantalla en la base de datos, hacemos otra peticion a la api
    // para obtener las capturas de pantalla del juego que no vienen en la url de la peticion anterior.
    if (!screenshots || screenshots.length === 0) {
      const screenshotsRes = await fetch(
        `https://api.rawg.io/api/games/${id}/screenshots?key=${API_KEY}`
      );
      const screenshotsData = await screenshotsRes.json();
      screenshots = screenshotsData.results.map((s) => s.image); // Obtenemos las capturas de pantalla del juego y las guardamos en un array, results es un array de objetos y de cada objeto obtenemos la propiedad image.
    }

    // si el juego viene de la Api, lo guardamos en Mongo
    const slugs = data.platforms.map((plat) => {
      const slug = plat.platform.slug;
      return slug === "ios" || slug === "android" ? "mobile" : slug;
    }); // el data que es el juego buscamos sus slug,por lo que recorremos las plataformas qe tenga y
    // de cada plataforma que tiene recogemos su slug,si su slug es ios o android o rellamamos mobile y 7
    // sino es ninguno de esos pues el slug que sea y obtenemos un array de slugs.

    const platformInMongo = await Platform.find({
      slug: { $in: slugs },
    }).select("_id");
    // ahora vamos a las plataformas que tenemos guardas en mongo y buscamos los slug que coincidan con estos slugs obtenidos,
    // y los que coincidan nos guardamos su id,obteniendo un array de ids de las plataformas que coinciden con los slugs obtenidos anteriormente.

    const platformIds = platformInMongo.map((p) => p._id); // transformamos el array de objetos anterior en un array de ids,para poder guardarlos en el juego.

    const gameData = {
      rawgId: String(data.id),
      name: data.name,
      imageUrl: data.background_image,
      genres: data.genres.map((g) => g.name),
      platforms: platformIds,
      description: data.description_raw || data.description,
      screenshots: screenshots,
      tags: data.tags?.map((t) => t.name) || [],
      background_image_additional: data.background_image_additional || null,
      clip: data.clip?.clip,
      released: data.released,
      stores: data.stores?.map((s) => s.store.name) || [],
      metacritic: data.metacritic,
      developers: data.developers?.map((d) => d.name) || [],
      esrbRating: data.esrb_rating?.name || null,
      lastImportedAt: new Date(),
    };

    const updatedGame = await Game.findOneAndUpdate(
      { rawgId: String(data.id) },
      gameData,
      {
        upsert: true,
        new: true,
      }
    ); // updateOne busca el juego por su rawgId, y si lo encuentra lo actualiza con los datos que hemos recogido de la api, y si no lo encuentra lo crea con esos datos.
    // upsert: true significa que si no existe el juego, lo crea con los datos que le pasamos.(update + insert) y new:true significa que nos devuleva el juego actualizado y no el antiguo.
    const populatedGame = await Game.findById(updatedGame._id).populate(
      "platforms",
      "name slug"
    );
    return res.status(200).json(populatedGame); // Devolvemos el juego obtenido de la Api.
  } catch (error) {
    console.error("Error en getGameById:", error); // Si hay un error, lo mostramos por consola.
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getGames, getGameById };

// const Game = require("../models/gameModel");

// const getGames = async (req, res) => {
//   const page = parseInt(req.query.page) || 1; // Si no se pasa la página o se pasa mal,por defecto será la 1.
//   const pageSize = 25;
//   try {
//     const games = await Game.find()
//       .sort({ name: 1 })
//       .skip((page - 1) * pageSize)
//       .limit(pageSize);
//     //  Obtenemos los juegos por paginacion, usamos sort para ordenarlos por orden alfabético(1 = orden ascendente de A a Z), usamos skip para la paginacion y
//     //que sepa que juegos skipear, (Ej si estamos en pagina 2,page=2 serian (2-1)*25 = 25,se omitirian los primeros 25 juegos) y por ultimo limit - limita los juegos a lo marcado en la const pageSize.
//     res.status(201).json(games);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// module.exports = getGames;
