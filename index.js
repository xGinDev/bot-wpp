const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { createCanvas, loadImage } = require("canvas");
const chromium = require("chromium");
const axios = require("axios"); // Necesario para manejar las imágenes

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: chromium.path,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  const info = await client.info;
  console.log("Bot connected with success!", info.wid.user);
});

client.on("auth_failure", (message) => {
  console.log("Auth failure!", message);
});

client.on("message", async (message) => {
  const chat = await message.getChat();

  if (!chat.isGroup) return;

  if (message.body.startsWith("/welcome ")) {
    const customMessage = message.body.replace("/welcome ", "");
    const mentions = [];
    const mentionText = [];

    for (const participant of chat.participants) {
      mentions.push(participant.id._serialized);
      mentionText.push(`@${participant.id.user}`);
    }

    await chat.sendMessage(
      `¡Bienvenido ${customMessage}! 🎊 \n\n CC: ${mentionText.join(" ")}`,
      {
        mentions,
      }
    );
  }

  if (message.body.startsWith("/tag")) {
    const customMessage = message.body.replace("/tag", "");
    const mentions = [];
    const mentionText = [];

    for (const participant of chat.participants) {
      mentions.push(participant.id._serialized);
      mentionText.push(`@${participant.id.user}`);
    }

    await chat.sendMessage(
      `🚨 ANUNCIO 🚨 \n\n Mensaje: ${customMessage} \n\n CC: ${mentionText.join(
        " "
      )}`,
      {
        mentions,
      }
    );
  }

  if (message.body.toLocaleLowerCase().startsWith("/insulto")) {
    const mentions = message.mentionedIds;

    const insultos = [
      "Eres más feo, que abrazar a la mamá con el pene parado.",
      "Prefiero voltear las tajadas del sarten caliente, con la punta del chimbo, que estar con ud.",
      "Eres uribista de corazón",
    ];

    const insultoRandom = insultos[Math.floor(Math.random() * insultos.length)];

    if (mentions.length === 0) {
      await chat.sendMessage(
        "💌 Usa el comando mencionando a alguien:\n/insulto @usuario"
      );
      return;
    }

    const targetId = mentions[0];

    await chat.sendMessage(
      `🤬 Cariñitos 🤬  \n\n @${targetId.split("@")[0]}, ${insultoRandom}`,
      {
        mentions: [targetId],
      }
    );
  }

  if (message.body.toLocaleLowerCase().startsWith("/counter")) {
    const mentions = message.mentionedIds;

    const insultos = [
      "Su mamá que busca la emisora en spotify",
      "Su mamá que se caso en una ladrillera",
      "Su mamá que lava los platos con intibon",
      "Su mamá que que pega las fotos familiares en el álbum JET",
      "Su mamá que se caé y pide perdón",
      "Su mamá que lo recoge de clases en línea",
      "Su mamá que busca caso cerrado en Netflix",
      "Su mamá que estudia para el examen de orina",
      "Su mamá que se quedo atrapada en una tienda de colchones y durmio en el piso",
      "Su mamá que tiene el himno nacional de tono de llamada",
    ];

    const insultoRandom = insultos[Math.floor(Math.random() * insultos.length)];

    if (mentions.length === 0) {
      await chat.sendMessage(
        "💌 Usa el comando mencionando a alguien:\n/insulto @usuario"
      );
      return;
    }

    const targetId = mentions[0];

    await chat.sendMessage(
      `Sin llorar 🥺  \n\n @${targetId.split("@")[0]}, ${insultoRandom}`,
      {
        mentions: [targetId],
      }
    );
  }

  if (message.body.toLocaleLowerCase().startsWith("/chiste")) {
    const chistesito = [
      "¿Quién descubrió el fuego?.. Pinocho mientras se hacía la paja",
    ];

    const chiste = chistesito[Math.floor(Math.random() * chistesito.length)];

    await chat.sendMessage(`Chistesito  \n\n ${chiste}`);
  }

  if (message.body.toLowerCase().startsWith("/selected")) {
    const args = message.body.split(" ");
    if (args.length < 2) {
      await chat.sendMessage(
        "💡 Uso correcto:\n/selected [gay|otaku|cachón|random] @usuario (opcional)"
      );
      return;
    }

    const option = args[1].toLowerCase();
    const validOptions = ["gay", "otaku", "cachón", "random"];

    if (!validOptions.includes(option)) {
      await chat.sendMessage(
        "❌ Opción no válida. Usa: gay, otaku, cachón o random"
      );
      return;
    }

    let targetContact;
    const mentionedIds = message.mentionedIds;

    // Si se mencionó a alguien, usar esa persona
    if (mentionedIds.length > 0) {
      targetContact = await client.getContactById(mentionedIds[0]);
    } else {
      // Si es "random" y no se mencionó a nadie, seleccionar aleatoriamente
      if (option === "random") {
        const randomIndex = Math.floor(
          Math.random() * chat.participants.length
        );
        targetContact = chat.participants[randomIndex];
      } else {
        await chat.sendMessage(
          "ℹ️ Debes mencionar a alguien o usar 'random' para selección aleatoria"
        );
        return;
      }
    }

    // Definir los mensajes para cada opción
    const messages = {
      gay: `🏳️‍🌈 @${targetContact.id.user} es el gay del grupo, que orgullo!`,
      otaku: `🇯🇵 @${targetContact.id.user} es el otaku del grupo, mira ese pelo aceitoso!`,
      cachón: `💔 @${targetContact.id.user} es el cachón del grupo, le encanta que le pisen los tenis!`,
      random: `🎲 @${
        targetContact.id.user
      } fue seleccionado aleatoriamente para ser el ${
        validOptions[Math.floor(Math.random() * 3)]
      } del grupo!`,
    };

    await chat.sendMessage(messages[option], {
      mentions: [targetContact.id._serialized],
    });
  }

  if (message.body.startsWith("/medition")) {
    const mentions = message.mentionedIds;
    if (mentions.length === 0) {
      await chat.sendMessage(
        "👀 Debes mencionar a alguien, ejemplo:\n/medition @pepito"
      );
      return;
    }

    const targetId = mentions[0];
    const contact = await client.getContactById(targetId);
    const feura = Math.floor(Math.random() * 101); // 0 a 100
    const profilePicUrl = await contact.getProfilePicUrl();

    if (!profilePicUrl) {
      await chat.sendMessage(
        `@${contact.number} tiene un ${feura}% de homosexualidad 😬 (pero no tiene foto o la tiene privada). Eso lo hace más homosexual`,
        {
          mentions: [contact],
        }
      );
      return;
    }

    try {
      // Usar axios para obtener la imagen
      const response = await axios.get(profilePicUrl, {
        responseType: "arraybuffer",
      });
      const profileBuffer = Buffer.from(response.data);

      const editedImageBuffer = await createLgtbiOverlay(profileBuffer);
      const media = new MessageMedia(
        "image/png",
        editedImageBuffer.toString("base64")
      );

      await chat.sendMessage(media, {
        caption: `@${contact.number} tiene un ${feura}% de homosexualidad 😬`,
        mentions: [contact],
      });
    } catch (error) {
      console.error("❌ Error generando imagen:", error);
      await chat.sendMessage(
        `@${contact.number} tiene un ${feura}% de homosexualidad 😬 (error al procesar la imagen)`,
        {
          mentions: [contact],
        }
      );
    }
  }
});

async function createLgtbiOverlay(profileBuffer) {
  try {
    const profileImg = await loadImage(profileBuffer);

    // Asegurar un tamaño razonable
    const width = Math.min(1024, profileImg.width);
    const height = Math.min(1024, profileImg.height);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(profileImg, 0, 0, width, height);

    const rainbow = createRainbowOverlay(width, height);
    ctx.globalAlpha = 0.4;
    ctx.drawImage(rainbow, 0, 0);

    return canvas.toBuffer("image/png");
  } catch (error) {
    console.error("❌ Error al procesar imagen:", error);
    throw error;
  }
}

function createRainbowOverlay(width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const colors = [
    "#FF0018",
    "#FFA52C",
    "#FFFF41",
    "#008018",
    "#0000F9",
    "#86007D",
  ];
  const stripeHeight = height / colors.length;

  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * stripeHeight, width, stripeHeight);
  });

  return canvas;
}

const express = require("express");
const app = express();

app.get("/", (_, res) => res.send("Bot is alive"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`HTTP server alive on port ${PORT}`);
});

client.initialize();
