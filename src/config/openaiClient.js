const { OpenAI } = require("openai");

// crea una instancia del cliente OpenAI y le asigna la clave de API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai;
