import { Client, LocalAuth, Message } from "whatsapp-web.js";
// import { handdler } from "./business_rules";
import { sendQR } from "./send_mail";
import QRCode from "qrcode";
import "dotenv/config";
import { handdler } from "./business_rules";

// Aquí puedes mantener la configuración del cliente
const client = new Client({
  puppeteer: {
    executablePath: "/usr/bin/google-chrome-stable",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
  },
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

export const connectWhatsApp = () => {
  client.initialize();

  client.on("qr", async (qr: string) => {
    console.log("GENERATING QR");
    let qrText = await QRCode.toString(qr);
    console.log(qrText);
    sendQR("agustintommasi@gmail.com", "QR CODE", qrText);
  });

  client.on("authenticated", () => {
    console.log("Authenticated!");
  });

  client.on("ready", () => {
    console.log("Ready!");
    const send_message: string[] = process.env.ALERT_ONLINE?.split(",") || [];
    send_message.forEach((value) => {
      const message = "*Online*";
      sendMessage(value, message);
    });
  });

  client.on("message", async (message: Message) => {
    if (message.body === "!ping") {
      const reply = "```pong```";
      message.reply(reply);
      return;
    }

    handdler({ from: message.from.replace("@c.us", ""), text: message.body });
  });
};

export async function sendMessage(number: string, message: string) {
  const chatId = `${number}@c.us`;
  client.sendMessage(chatId, message);
}
