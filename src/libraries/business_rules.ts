// import { sendEmail } from "./send_mail";
import TEXT_DIALOGS from "../storage/dialogs.json";

import { Conversation } from "../interfaces/conversation";
import { Client, Message, MessageMedia } from "whatsapp-web.js";
import { addChat, archiveConversation, loadConversation } from "./db_functions";
import { clearTimer, startTimer } from "./timer";

const CLOSE_SESSION_DIALOG = "Sesión Finalizada.";
const INVALID_OPTIONS_DIALOG = "Opción no válida, por favor insertar un número que este disponible";
const RETURN_DIALOG = "Volviendo al menú anterior"; // volver menu al anterior, agregar como opcion
const MAIN_MENU_DIALOG = "Volviendo al menú principal.";
const END_CHAT_DIALOG = "Chat finalizado. Muchas gracias por escribirnos!" // agregar en textos como opcion 00

let client: Client;


async function readConverastion(number: string) {
  let conversations: Conversation[] = await loadConversation(number);
  main(conversations, number)
}

async function sendMessage(number: string, message: string, code: string) {
  client.sendMessage(`${number}@c.us`, message);
  await addChat(number, "BOT", message, code)
}

async function sendImage(number: string, image: string, code: string) {
  const media = MessageMedia.fromFilePath('./public/images/' + image);
  await client.sendMessage(`${number}@c.us`, media);
  await addChat(number, "BOT", image, code)

}

async function mainMenu(number: string, code: string) {
  client.sendMessage(`${number}@c.us`, MAIN_MENU_DIALOG);
  await addChat(number, "BOT", MAIN_MENU_DIALOG, code);
  await archiveConversation(number)
  readConverastion(number)
}

async function closeSession(number: string, code: string) {
  clearTimer(number)
  client.sendMessage(`${number}@c.us`, CLOSE_SESSION_DIALOG);
  await addChat(number, "BOT", CLOSE_SESSION_DIALOG, code);
  await archiveConversation(number)
}

function replaceValues(text: string, replacements: { [key: string]: string }): string {
  Object.keys(replacements).forEach(key => {
    const regex = new RegExp(key, 'g');
    text = text.replace(regex, replacements[key]);
  });
  return text;
}

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
      case "00":
        closeSession(number, CODE)
        return;
      case "1":
        main_services(conversations, number);
        return;
      case "2":
        main_claims(conversations, number);
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

function main_services(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']["text"];
  const CODE = TEXT_DIALOGS['main']['services']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "1":
        main_services_trash(conversations, number);
        return;
      case "2":
        main_services_debris(conversations, number);
        return;
      case "3":
        main_services_animal_care(conversations, number);
        return;
      case "4":
        main_services_difer_collect(conversations, number);
        return;
      case "9":
        mainMenu(number, CODE)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services(conversations, number);
          return;
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_services_trash(conversations: Conversation[], number: string) {

  const DIALOG = TEXT_DIALOGS['main']['services']['trash']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['trash']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "1":
        main_services_trash_zone_a(conversations, number);
        return
      case "2":
        main_services_trash_zone_b(conversations, number);
        return
      case "3":
        main_services_trash_zone_c(conversations, number);
        return
      case "4":
        main_services_trash_map(conversations, number);
        return
      case "9":
        main_services(conversations, number)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services_trash(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_services_trash_zone_a(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']['trash']['zone_a']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['trash']['zone_a']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "1":
        main_services_trash_zone_a_claim(conversations, number);
        return;
      case "9":
        main_services_trash(conversations, number)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services_trash_zone_a(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_services_trash_zone_a_claim(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']['trash']['zone_a']['claim']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['trash']['zone_a']['claim']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "9":
        main_services_trash_zone_a(conversations, number);
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services_trash_zone_a_claim(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_services_trash_zone_b(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']['trash']['zone_b']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['trash']['zone_b']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "1":
        main_services_trash_zone_b_claim(conversations, number);
        return;
      case "9":
        main_services_trash(conversations, number)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services_trash_zone_b(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_services_trash_zone_b_claim(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']['trash']['zone_b']['claim']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['trash']['zone_b']['claim']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "9":
        main_services_trash_zone_b(conversations, number);
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services_trash_zone_b_claim(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_services_trash_zone_c(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']['trash']['zone_c']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['trash']['zone_c']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "1":
        main_services_trash_zone_c_claim(conversations, number);
        return;
      case "9":
        main_services_trash(conversations, number)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services_trash_zone_c(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_services_trash_zone_c_claim(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']['trash']['zone_c']['claim']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['trash']['zone_c']['claim']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "9":
        main_services_trash_zone_c(conversations, number);
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services_trash_zone_c_claim(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

async function main_services_trash_map(conversations: Conversation[], number: string) {
  const DIALOG = "map.jpg";
  const CODE = "map";
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    // conversations.shift();
    main_services_trash(conversations, number)
    return;
  }
  await sendImage(number, DIALOG, CODE)
  main_services_trash(conversations, number)
  return;
}

function main_services_debris(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']['debris']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['debris']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "9":
        main_services(conversations, number)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services_debris(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_services_animal_care(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']['animal_care']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['animal_care']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "1":
        main_services_animal_care_castrations(conversations, number);
        return
      case "2":
        main_services_animal_care_vet_care(conversations, number);
        return
      case "3":
        main_services_animal_care_animal_cemetery(conversations, number);
        return
      case "9":
        main_services(conversations, number)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services_animal_care(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_services_animal_care_castrations(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']['animal_care']['castrations']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['animal_care']['castrations']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "9":
        main_services_animal_care(conversations, number)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services_animal_care_castrations(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_services_animal_care_vet_care(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']['animal_care']['vet_care']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['animal_care']['vet_care']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "9":
        main_services_animal_care(conversations, number)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services_animal_care_vet_care(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_services_animal_care_animal_cemetery(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']['animal_care']['animal_cemetery']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['animal_care']['animal_cemetery']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "9":
        main_services_animal_care(conversations, number)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services_animal_care_animal_cemetery(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_services_difer_collect(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['services']['animal_care']["text"];
  const CODE = TEXT_DIALOGS['main']['services']['animal_care']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "9":
        main_services(conversations, number)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_services_difer_collect(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_claims(conversations: Conversation[], number: string) {

  const DIALOG = TEXT_DIALOGS['main']['claims']["text"];
  const CODE = TEXT_DIALOGS['main']['claims']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "1":
        main_claims_claim(conversations, number);
        return;
      case "2":
        main_claims_claim(conversations, number);
        return;
      case "3":
        main_claims_claim(conversations, number);
        return;
      case "4":
        main_claims_claim(conversations, number);
        return;
      case "5":
        main_claims_claim(conversations, number);
        return;
      case "6":
        main_claims_claim(conversations, number);
        return;
      case "7":
        main_claims_claim(conversations, number);
        return;
      case "8":
        main_claims_claim(conversations, number);
        return;
      case "9":
        mainMenu(number, CODE)
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_claims(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

function main_claims_claim(conversations: Conversation[], number: string) {
  const DIALOG = TEXT_DIALOGS['main']['claims']['claim']["text"];
  const CODE = TEXT_DIALOGS['main']['claims']['claim']["code"];
  while (conversations[0]?.content != DIALOG && conversations[0]) {
    conversations.shift();
  }
  if (conversations[0]) {
    conversations.shift();
    switch (conversations[0]?.content) {
      case "00":
        closeSession(number, CODE)
        return;
      case "0":
        mainMenu(number, CODE)
        return;
      case "9":
        main_claims(conversations, number);
        return;
      default:
        conversations.shift();
        if (conversations[0]) {
          main_claims_claim(conversations, number);
          return
        } else {
          sendMessage(number, INVALID_OPTIONS_DIALOG, CODE)
        }
    }
  }
  sendMessage(number, DIALOG, CODE)
  return;
}

