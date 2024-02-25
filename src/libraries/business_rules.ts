// import { sendEmail } from "./send_mail";
import { Conversation } from "../interfaces/conversation";
import { Client, Message, MessageMedia } from "whatsapp-web.js";
import { addChat, archiveConversation, loadConversation } from "./db_functions";
import { clearTimer, startTimer } from "./timer";
import TEXT_DIALOGS from "../storage/dialogs.json";

const CLOSE_SESSION_DIALOG = "Sesión Finalizada.";
const INVALID_OPTIONS_DIALOG = "Opción no válida.";
const MAIN_MENU_DIALOG = "Volviendo al menu principal.";
const END_CHAT_DIALOG = "Chat finalizado."


let client: Client;


export async function handdler(c: Client, message: Message) {
  client = c;
  let number: string = message.from.replace('@c.us', '');

  startTimer(client, number, END_CHAT_DIALOG)

  await addChat(number, "USER", message.body)
  await readConverastion(number);
}

function main(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']["text"];
  const CODE = TEXT_DIALOGS['main']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }

  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "1":
        services(conversations, number);
        return;
      case "2":
        claims(conversations, number);
        return;
      // case "3":
      //   claims(full_chat);
      // return;
      // case "4":
      //   suggestions(full_chat);
      // return;
      case "0":
        closeSession(number, CODE)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main(conversations, number);
          return;
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function services(conversations: Conversation[], number: string) {

  const DIALOG = TEXT_DIALOGS['main']['services']["text"];
  const CODE = TEXT_DIALOGS['main']['services']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "0":
        mainMenu(number, CODE)
        return;
      case "1":
        services_trash(conversations, number);
        return;
      // case "2":
      //   information_maintenance(conversation, response);
      //   return;
      case "5":
        closeSession(number, CODE)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main(conversations, number);
          return;
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function claims(conversations: Conversation[], number: string) {

  const DIALOG = TEXT_DIALOGS['main']['claims']["text"];
  const CODE = TEXT_DIALOGS['main']['claims']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "0":
        mainMenu(number, CODE)
        return;
      case "1":
        services_trash(conversations, number);
        return;
      // case "2":
      //   information_maintenance(conversation, response);
      //   return;
      case "5":
        closeSession(number, CODE)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main(conversations, number);
          return;
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function services_trash(conversations: Conversation[], number: string) {

  const DIALOG = TEXT_DIALOGS['main']['services']['trash']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['trash']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "0":
        mainMenu(number, CODE)
        return;
      case "1":
        information_trash_zone_1(conversations, number);
        return
      case "4":
        services_trash_map(conversations, number);
        return
      case "5":
        closeSession(number, CODE)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function information_trash_zone_1(conversations: Conversation[], number: string) {

  const DIALOG = TEXT_DIALOGS['main']['services']['trash']['zone_1']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['trash']['zone_1']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "0":
        mainMenu(number, CODE)
        return;
      case "1":
        claim_form(conversations, number);
        mainMenu(number, CODE)
        return;
      case "5":
        closeSession(number, CODE)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

async function services_trash_map(conversations: Conversation[], number: string) {

  const DIALOG = "map.jpg";
  const CODE = "map";
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    // conversations.shift();
    services_trash(conversations, number)
    return;
  }
  await sendImage(number, DIALOG, CODE)
  services_trash(conversations, number)
  return;
}

function claim_form(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']['trash']['zone_1']['claim']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['trash']['zone_1']['claim']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "0":
        mainMenu(number, CODE)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

// function claim(conversations: Conversation[], number: string) {

//   // const DIALOG = TEXT_DIALOGS['main']['services']['trash']['zone_1']["claim"]["text"];
//   // const DIALOG = TEXT_DIALOGS['main']['services']['trash']['zone_1']["claim"]["text"];

//   // const TO = TEXT_DIALOGS['introduction']['information']['trash']['zone_1']["claim"]["sendEmail"]["to"]
//   // const SUBJECT = TEXT_DIALOGS['introduction']['information']['trash']['zone_1']["claim"]["sendEmail"]["subject"]
//   // const TEXT = TEXT_DIALOGS['introduction']['information']['trash']['zone_1']["claim"]["sendEmail"]["text"]

//   // const code = Math.floor(Math.random() * 900000) + 100000;

//   // const replacements = {
//   //   '[code]': code.toString(),
//   //   '[number]': conversations[0].number
//   // };

//   // sendMessage(number, DIALOG,)
//   // sendEmail(TO, SUBJECT, replaceValues(TEXT, replacements));

//   // return
// }

async function sendMessage(number: string, message: string, code: string) {
  client.sendMessage(`${number}@c.us`, message);
  await addChat(number, "BOT", message, code)
}

async function sendImage(number: string, image: string, code: string) {
  const media = MessageMedia.fromFilePath('./public/images/' + image);
  await client.sendMessage(`${number}@c.us`, media);
  await addChat(number, "BOT", image, code)

}

async function closeSession(number: string, code: string) {
  clearTimer(number)
  client.sendMessage(`${number}@c.us`, CLOSE_SESSION_DIALOG);
  await addChat(number, "BOT", CLOSE_SESSION_DIALOG, code);
  await archiveConversation(number)
}

async function mainMenu(number: string, code: string) {
  client.sendMessage(`${number}@c.us`, MAIN_MENU_DIALOG);
  await addChat(number, "BOT", MAIN_MENU_DIALOG, code);
  await archiveConversation(number)
  readConverastion(number)
}

async function readConverastion(number: string) {
  let conversations: Conversation[] = await loadConversation(number);
  main(conversations, number)
}



function replaceValues(text: string, replacements: { [key: string]: string }): string {
  Object.keys(replacements).forEach(key => {
    const regex = new RegExp(key, 'g');
    text = text.replace(regex, replacements[key]);
  });
  return text;
}

