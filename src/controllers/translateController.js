const translateDescription = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Texto requerido para traducir." });
  }

  try {
    const apiRes = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: "es",
        format: "text",
      }),
    });

    const data = await apiRes.json();
    res.json({ translatedText: data.translatedText });
  } catch (error) {
    console.error("Error en traducción:", error);
    res.status(500).json({ error: "Error al traducir el texto." });
  }
};

module.exports = { translateDescription };
