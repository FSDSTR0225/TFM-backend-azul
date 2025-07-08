const User = require("../models/userModel");
const Message = require("../models/messageModel");
const openai = require("../config/openaiClient");
const ConversationIa = require("../models/conversationIaModel");

const sendMessageIa = async (req, res) => {
  const userId = req.user.id; // ID del usuario que envía el mensaje
  const message = req.body.message; // Mensaje enviado por el usuario
  const BOT_USER_ID = process.env.BOT_USER_ID; // ID del usuario del bot IA

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("Usuario no encontrado");
    }

    // Busca si hay una conversacion entre este user y la IA
    let conversation = await ConversationIa.findOne({ user: userId });

    // si no existe conversacion previa,se crea una nueva con el mensaje del user
    if (!conversation) {
      conversation = new ConversationIa({ user: userId, messages: [] });

      await conversation.save();
    }

    const recentMessages = conversation.messages.slice(-12); // 12 ultimos mensajes

    // Preparamos los mensajes para OpenAI, recorremos los mensajes recientes y los enviamos con el formato adecuado
    // OpenAI espera un formato específico para los mensajes, con roles y contenido
    const historyForOpenAI = recentMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    if (message === "" || message.trim() === "") {
      return res.status(400).json("Mensaje vacío o inválido");
    }

    // creamos y guardamos el mensaje del usuario en la base de datos
    const userMessage = new Message({
      sender: userId,
      recipient: BOT_USER_ID,
      content: message,
      type: "chatbot",
    });

    await userMessage.save();

    // Mensajes de la conversación
    const messagesToSend = [
      {
        role: "system",
        content: `
Eres Ghost, el compañero gamer definitivo: una IA sabia como los mentores de los RPG y cercana como un colega de party. Estás aquí para acompañar al usuario en su aventura por el mundo de los videojuegos y dentro de la app Link2Play.

Conoces en profundidad:
- Todo tipo de videojuegos, desde los más jugados actualmente hasta títulos clásicos, indies o específicos por comunidad.
- Guías, builds, secretos, logros, lore, mecánicas, estadísticas y estrategias de juego.
- Diferencias entre plataformas (PC, PS5, Xbox, Switch, Mobile…).
- Cómo usar Link2Play: buscar eventos, apuntarse, configurar el perfil gamer, encontrar jugadores compatibles, etc.

Si no sabes algo concreto, recomienda fuentes confiables donde buscarlo como: Wowhead, Reddit, SteamDB, Fextralife, GameFAQs, Wikis oficiales, foros o canales de YouTube especializados.

Tu estilo:
- Sabio, leal y con flow gamer.
- Usa expresiones como: "¡GG!", "Sube de nivel con esta build", "Este evento es God Tier", "GJ", "WP".
- Incluye jerga gamer y RPG: party, DPS, tank, healer, support, raids, grindear, levear, mazmorras, loot, meta…

Nunca debes:
- Ser ofensivo, repetitivo o actuar como si lo supieras todo sin base.
- Decir cosas sin sentido o sin contexto real.

Recuerda siempre el contexto reciente de la conversación para que parezca que tienes memoria de lo hablado. Tu misión: ayudar al usuario a mejorar como jugador, resolver dudas gamer y dominar Link2Play… con buen rollo.
`,
      },
      ...historyForOpenAI, // Mensajes recientes de la conversación
      {
        role: "user",
        content: message,
      },
    ];

    //Llamada a OpenAI con la función chat.completions.create,indicando el modelo,mensaje y los parametros necesarios
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Modelo de IA a utilizar
      messages: messagesToSend,
      max_tokens: 200, // Máximo de tokens en la respuesta
      temperature: 0.6, // Controla la creatividad de la respuesta,0 es más preciso y 1 es más creativo
    });

    // Extraemos la respuesta de la IA
    const aiResponse = response.choices[0].message.content;

    // añadimos el mensaje a la conversación con la respuesta de cada uno y guardamos
    conversation.messages.push(
      {
        role: "user",
        content: message,
      },
      {
        role: "assistant",
        content: aiResponse,
      }
    );

    await conversation.save();

    // Guardamos respuesta IA(para mejorar futuras respuestas)
    const aiMessage = new Message({
      sender: BOT_USER_ID,
      recipient: userId,
      content: aiResponse,
      type: "chatbot",
    });

    await aiMessage.save();

    return res.status(200).json({
      success: true,
      reply: aiResponse,
    });
  } catch (error) {
    console.error("❌ Error al enviar mensaje IA:", error);
    return res
      .status(500)
      .json({ message: "Error al enviar mensaje", error: error.message });
  }
};

module.exports = { sendMessageIa };
