const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
const User = require("../models/userModel");

console.log("API KEY:", process.env.STEAM_API_KEY);

passport.use(
  new SteamStrategy(
    {
      returnURL: process.env.STEAM_RETURN_URL,
      realm: process.env.STEAM_REALM,
      apiKey: process.env.STEAM_API_KEY,
      passReqToCallback: true,
    },
    async (req, identifier, profile, done) => {
      try {
        console.log("🧠 Callback ejecutado tras redirección de Steam");
        console.log("🔍 Session completa:", req.session);
        console.log("📌 Identifier recibido:", identifier);
        console.log("👤 Perfil recibido:", profile);

        const userId = req.session.link2playUserId;
        console.log("🧾 userId extraído de session:", userId);

        const user = await User.findById(userId);
        if (!user) {
          console.log("❌ Usuario no encontrado en la BD");
          return done(null, false);
        }

        user.steamId = profile.id;
        await user.save();
        console.log("✅ Steam ID guardado correctamente");

        return done(null, user);
      } catch (error) {
        console.error("❌ Error en estrategia Steam:", error);
        return done(error);
      }
    }
  )
);

// 🔐 Serializa el usuario para la sesión
passport.serializeUser((user, done) => {
  done(null, user.id); // o user._id si usas Mongoose
});

// 🔓 Deserializa el usuario desde la sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
