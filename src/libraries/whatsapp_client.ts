import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import { handdler } from './business_rules';
import { sendQR } from './send_mail';
import QRCode from 'qrcode';
import 'dotenv/config';

// Aquí puedes mantener la configuración del cliente
export const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'client-one',
    }),
});

client.on('qr', async (qr: string) => {
    console.log('GENERATING QR');
    let qrText = await QRCode.toString(qr);
    console.log(qrText);
    sendQR("agustintommasi@gmail.com", "QR CODE", qrText);
});

client.on('authenticated', () => {
    console.log('Authenticated!');
});

client.on('ready', () => {
    console.log('Ready!');
    const send_message: string[] = process.env.ALERT_ONLINE?.split(',') || [];
    send_message.forEach((value) => {
        const chatId = `${value}@c.us`;
        const message = '*Online*';
        client.sendMessage(chatId, message);
    });
});

client.on('message', async (message: Message) => {
    if (message.body === '!ping') {
        const reply = '```pong```';
        message.reply(reply);
        return;
    }

    await handdler(client, message);
});

