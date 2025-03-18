import express from "express";
import axios from "axios";

import { handdler } from "./business_rules";

import dotenv from "dotenv";
dotenv.config();

const {
  VERIFY_TOKEN,
  WA_PHONE_NUMBER_ID,
  CLOUD_API_VERSION,
  CLOUD_API_ACCESS_TOKEN,
  WHATSAPP_PORT,
} = process.env;

export const connectWhatsApp = () => {
  const app = express();
  app.use(express.json());

  app.post("/webhooks", async (req: any, res: any) => {
    // check if the webhook request contains a message
    // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    // log incoming messages
    console.log("Incoming webhook message:", JSON.stringify(req.body));

    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    // console.log(message);

    // check if the incoming message contains text
    if (message?.type === "text" || message?.type === "interactive") {
      // extract the business number to send the reply from it
      // const business_phone_number_id =
      //   req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

      // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
      // sendMessage(message.from, message.text.body);
      handdler(message);

      // mark incoming message as read
      sendMessage({
        messaging_product: "whatsapp",
        status: "read",
        message_id: message.id,
      });
    }

    res.sendStatus(200);
  });

  // accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
  // info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
  app.get("/webhooks", (req: any, res: any) => {
    console.log("Webhook solicitado");

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // check the mode and token sent are correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // respond with 200 OK and challenge token from the request
      res.status(200).send(challenge);
      console.log("Webhook verified successfully!");
    } else {
      // respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  });

  app.get("/", (req: any, res: any) => {
    res.send(`<pre>Nothing to see here.
  Checkout README.md to start.</pre>`);
  });

  app.listen(WHATSAPP_PORT, () => {
    console.log(`Server is listening on port: ${WHATSAPP_PORT}`);
  });

  // Añade estos endpoints de prueba
  app.get("/test", (req: any, res: any) => {
    res.status(200).json({
      status: "ok",
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/verify", (req: any, res: any) => {
    res.status(200).json({
      verify_token: VERIFY_TOKEN,
      cloud_api_token: CLOUD_API_ACCESS_TOKEN
        ? "Configurado"
        : "No configurado",
      wa_phone_id: WA_PHONE_NUMBER_ID ? "Configurado" : "No configurado",
      api_version: CLOUD_API_VERSION || "No configurado",
    });
  });

  // Endpoint de prueba para verificar el token
  app.get("/token-test", async (req: any, res: any) => {
    try {
      const response = await axios({
        method: "GET",
        url: `https://graph.facebook.com/v21.0/me`,
        headers: {
          Authorization: `Bearer ${CLOUD_API_ACCESS_TOKEN}`,
        },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({
        error: "Token inválido",
        details: error.response?.data || error.message,
      });
    }
  });
};

export async function sendMessage(data: any) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/${CLOUD_API_VERSION}/${WA_PHONE_NUMBER_ID}/messages`,
      headers: {
        Authorization: `Bearer ${CLOUD_API_ACCESS_TOKEN}`,
      },
      data: data,
    });
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:");
    throw error; // Rethrow the error if you want to handle it outside this function
  }
}
