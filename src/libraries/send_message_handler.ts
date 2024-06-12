import { sendMessage as officialSendMessage } from "./websockets_official";
import { sendMessage as alternativeSendMessage } from "./whatsapp_alternative";
import { addChat } from "./db_functions";
import dotenv from "dotenv";
dotenv.config();

export async function sendMessage(
  user: string,
  message: string,
  code?: string
) {
  if (process.env.OFFICIAL_WHATSAPP?.toLowerCase() === "true") {
    officialSendMessage({
      messaging_product: "whatsapp",
      to: user,
      text: { body: message },
    });
  } else {
    alternativeSendMessage(user, message);
  }
  await addChat(user, "BOT", message, code);
}

export async function sendList(
  user: string,
  message: string,
  options: any,
  code: string
) {
  officialSendMessage({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: user,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "Municipalidad de Oran",
      },
      body: {
        text: message,
      },
      footer: {
        text: "Desarrollado por SystemArt",
      },
      action: {
        button: "Opciones",
        sections: [
          {
            // title: "<LIST_SECTION_1_TITLE>",
            rows: options,
          },
        ],
      },
    },
  });
  await addChat(user, "BOT", message + options, code);
}

export async function sendImage(user: string, image: string) {
  await officialSendMessage({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: user,
    type: "image",
    image: {
      id: image,
    },
  });
}
