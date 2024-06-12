import WhatsApp from "whatsapp";
import dotenv from 'dotenv';

dotenv.config();

const { RECIPIENT_WAID, WA_PHONE_NUMBER_ID } = process.env;

// Your test sender phone number
const wa = new WhatsApp(parseInt(WA_PHONE_NUMBER_ID || ""));

// Enter the recipient phone number
const recipient_number = parseInt(RECIPIENT_WAID || "");

export async function send_message() {
  try {
    const sent_text_message = wa.messages.text(
      { body: "Hello world" },
      recipient_number
    );

    await sent_text_message.then((res: any) => {
    //  console.log(res.rawResponse());
    });
  } catch (e) {
    console.log(JSON.stringify(e));
  }
}
