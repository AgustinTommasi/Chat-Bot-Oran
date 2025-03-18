import { addChat, archiveConversation, loadConversation } from "./db_functions";
import { sendMessage } from "./send_message_handler";
import { clearTimer, startTimer } from "./timer";
import { sendPostRequest } from "./private_gpt";
import dotenv from "dotenv";
dotenv.config();

const END_CHAT_DIALOG = "Chat finalizado. Muchas gracias por escribirnos!"; // agregar en textos como opcion 00

export async function handdler(message: { from: string; text: string }) {
  const ingone_origin: string[] = process.env.IGNORE_ORIGIN?.split(",") || [];
  let next = true;
  ingone_origin.forEach((value) => {
    if (message.from.includes(value)) {
      const to = process.env.ALERT_ONLINE!;
      const message = "*overloaded server*";
      sendMessage(to, message);
      next = false;
    }
  });
  if (next) {
    // startTimer(message.from, END_CHAT_DIALOG);
    // await addChat(message.from, "USER", message.text);
    // main(message);
  }
}

async function main(message: any) {
  let messages = [
    {
      content: message.text,
      role: "user",
    },
  ];
  const response: string = await sendPostRequest(messages);

  sendMessage(message.from, response);
}
