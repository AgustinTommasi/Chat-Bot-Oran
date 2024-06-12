// Log libraries
import fs from "fs";
import util from "util";
// alternative whatsapp client
import { connectWhatsApp as connectAlternativeWhatsApp } from "./libraries/whatsapp_alternative";
// official whatsapp client
// import { send_message } from "./libraries/whatsapp_official";
import { connectWhatsApp as connectOfficialWhatsApp } from "./libraries/websockets_official";
// Archive chats
import { archiveAll } from "./libraries/db_functions";

// Read .env
import dotenv from "dotenv";
dotenv.config();

// Log console
const logFile = fs.createWriteStream(__dirname + "/debug.log", { flags: "a" });
const logStdout = process.stdout;

console.log = (d: any) => {
  logFile.write(util.format(d) + "\n");
  logStdout.write(util.format(d) + "\n");
};

console.log("STARTING...");

// Archive all chats at the beginning.
if (process.env.ARCHIVE_CHATS?.toLowerCase() === "true") {
  archiveAll();
}

// Chat engine selector
if (process.env.OFFICIAL_WHATSAPP?.toLowerCase() === "true") {
  connectOfficialWhatsApp();
  // test porpose
  // send_message();
} else {
  connectAlternativeWhatsApp();
}
