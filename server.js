// server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// 🔁 Importa tu bot
require("./index");

app.get("/", (req, res) => {
  res.send("🤖 Bot de WhatsApp está corriendo!");
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor Express activo en el puerto ${PORT}`);
});
