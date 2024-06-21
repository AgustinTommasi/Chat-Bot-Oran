import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.GPT_URL!.toString();

// Define las cabeceras (headers) para la solicitud
const headers = {
  "Content-Type": "application/json",
};

export async function sendPostRequest(messages: any): Promise<string> {
  const payload = {
    include_sources: true,
    messages: messages,
    stream: false,
    use_context: true,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = await response.json();
      return data?.choices[0].message.content;
    } else {
      return "Por favor vuelva a intentar en unos minutos.";
    }
  } catch (error) {
    return "Por favor vuelva a intentar en unos minutos. O contactese con +5493874566419";
  }
}
