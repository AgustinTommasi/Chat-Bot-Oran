import { archiveConversation } from "./db_functions";
import "dotenv/config";
import { sendMessage } from "./send_message_handler";

const cron: Map<string, NodeJS.Timeout> = new Map();
const chatTimeoutMilliseconds: number =
  parseInt(process.env.CHAT_TIMEOUT_MINUTES || "10", 10) * 1000 * 60;

export function startTimer(user: string, END_CHAT_DIALOG: string): void {
  clearTimer(user);
  const timerId: NodeJS.Timeout = setTimeout(async () => {
    await sendMessage(user, END_CHAT_DIALOG);
    archiveConversation(user);
  }, chatTimeoutMilliseconds); // Set timeout for 10 minutes

  cron.set(user, timerId);
}

export function clearTimer(from: string): void {
  const timer = cron.get(from);
  if (timer) {
    clearTimeout(timer);
    cron.delete(from);
  }
}
