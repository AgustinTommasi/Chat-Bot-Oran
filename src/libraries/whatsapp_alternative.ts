import { Client, LocalAuth, Message } from "whatsapp-web.js";
import fs from "fs";
// import { handdler } from "./business_rules";
import { sendQR } from "./send_mail";
import QRCode from "qrcode";
import "dotenv/config";
import { handdler } from "./business_rules";
import { messageAck } from "./send_message_handler";

// Aquí puedes mantener la configuración del cliente
const client = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/refs/heads/main/html/2.3000.1018090133-alpha.html",
  },
});

export const connectWhatsApp = () => {
  client.initialize();

  client.on("qr", async (qr: string) => {
    console.log("GENERATING QR");
    let qrText = await QRCode.toString(qr);
    console.log(qrText);
    sendQR(
      process.env.ALERT_EMAIL || "agustintommasi@gmail.com",
      "QR CODE",
      qrText
    );
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
    if (message.from.startsWith("status")) return; // add this line

    if (message.body === "!ping") {
      const reply = "```pong```";
      message.reply(reply);
      return;
    }

    handdler({ from: message.from.replace("@c.us", ""), text: message.body });
  });
};

client.on("message_create", async (msg: any) => {
  // const chat = await msg.getChat();

  // // console.log("msg");
  // // console.log(msg);
  // // console.log("msg.quotedMsg");
  // const message = msg.hasQuotedMsg ? await msg.getQuotedMessage() : msg;
  // // console.log(message);

  // // Handle view-once or quoted view-once messages
  // // if (msg._data.isViewOnce || msg.hasQuotedMsg) {
  // try {
  //   const media = await message.downloadMedia();
  //   console.log("media", media);

  //   fs.writeFileSync(
  //     `${
  //       message.type === "image"
  //         ? `./image-${Date.now()}.png`
  //         : message.type === "video"
  //         ? `./video-${Date.now()}.mp4`
  //         : `./ptt-${Date.now()}.mp3`
  //     }`,
  //     Buffer.from(media.data, "base64")
  //   );
  // } catch (error: any) {
  //   console.error("Failed to save view-once media:", error.message);
  // }
});

client.on("message_ack", (message: Message) => {
  messageAck(message.id.id, message.ack);
});

export async function sendReply(message: Message, reply: string) {
  message.reply(reply);
}

export async function sendMessage(
  number: string,
  message: string
): Promise<Message> {
  const chatId = `${number}@c.us`;

  const info = await client.sendMessage(chatId, message);
  // console.log(info);
  return info;
}
