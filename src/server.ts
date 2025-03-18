import express from "express";
import bodyParser from "body-parser";
import { sendMessage } from "./libraries/send_message_handler";
import { getMessageAcks } from "./libraries/db_functions";

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(bodyParser.json());

app.post("/api/send-whatsapp", async (req, res) => {
  const { number, message } = req.body;
  // check is a valid number

  if (!number || !message) {
    return res.status(400).json({ error: "Number and message are required" });
  }

  try {
    const message_id = await sendMessage(number, message);
    res.json({
      success: true,
      message_id,
      message: "Mensaje enviado correctamente",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Nuevo endpoint para obtener message_ack por lista de message_id
app.post("/api/acks", async (req, res) => {
  const { message_ids } = req.body;  
  try {
    const response = await getMessageAcks(message_ids);
    res.json({ success: true, data: response });
  } catch (error) {
    console.error("Error en POST /messages/ack:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export const startServer = () => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
