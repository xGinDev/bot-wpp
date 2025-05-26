const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const chromium = require("chromium");

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

  if (message.body.toLocaleLowerCase().startsWith("/insulto")) {
    const mentions = message.mentionedIds;

    const insultos = [
      "Eres más feo, que abrazar a la mamá con el pene parado.",
      "Prefiero voltear las tajadas del sarten caliente, con la punta del chimbo, que estar con ud.",
      "Eres uribista de corazón"
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
      "Su mamá que tiene el himno nacional de tono de llamada"
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
      "¿Quién descubrió el fuego?.. Pinocho mientras se hacía la paja"
    ];

    const chiste = chistesito[Math.floor(Math.random() * chistesito.length)];

    await chat.sendMessage(
      `Chistesito  \n\n ${chiste}`,
    );
  }
});

client.initialize();
