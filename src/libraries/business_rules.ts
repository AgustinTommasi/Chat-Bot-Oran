import { addChat, archiveConversation, loadConversation } from "./db_functions";
import { clearTimer, startTimer } from "./timer";
import { sendMessage } from "./send_message_handler";
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
    console.log("paso");
    startTimer(message.from, END_CHAT_DIALOG);
    await addChat(message.from, "USER", message.text);

    main(message);
  }
}

function main(message: any) {
  sendMessage(message.from, "message");
}
