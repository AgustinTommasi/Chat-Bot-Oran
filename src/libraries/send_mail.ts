import 'dotenv/config';
import nodemailer from 'nodemailer';
import { MailOptions } from "../interfaces/mail_options";

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    let transporter = nodemailer.createTransport({
        service: process.env.SENDER_SERVICE,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD,
        },
    });

    let mailOptions: MailOptions = {
        from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
        to: to,
        subject: subject,
        html: html
    };

    console.log(html);

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
}

export function sendQR(to: string, subject: string, qr: string) {

    let HTML = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>QR Code as Text</title>
        <style>
            .ascii-qr {
                font-family: monospace;
                white-space: pre;
                font-size: 8px; /* You may need to adjust this based on your ASCII art */
                line-height: 9px; /* Adjust line height to fit the QR code properly */
            }
        </style>
    </head>
    <body>
        <pre class="ascii-qr"> ${qr}
        </pre>
    </body>
    </html>`

    sendEmail(to, subject, HTML)
}

