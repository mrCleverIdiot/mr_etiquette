import express from 'express';
import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';

import mysql from "mysql2/promise";
const { Client, MessageMedia } = pkg;
import cors from 'cors';
import { resolve, join } from 'path';

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
});

const app = express();
const PORT = 9090;

app.use(cors());
// Serve static files (e.g., attachments)
app.use('/attachments', express.static('attachments'));



// Handle sending WhatsApp messages
app.get('/send', async (req, res) => {
    const mobile = req.query.mobile;
    const pdfName = req.query.pdfName;
    const billName = req.query.billName;
    const amt = req.query.amt;

    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await sendWhatsAppMessages(mobile, pdfName, billName, amt);
        res.status(200).send('Messages sent successfully');
    } catch (error) {
        console.error('Error sending messages:', error);
        res.status(500).send('Error sending messages');
    }
});

app.get('/getInvoiceNumber', async (req, res) => {
    try {
        const invoiceNumber = await getInvoiceNumber(); // Await the promise
        res.status(200).json({ invoiceNumber });
    } catch (error) {
        console.error('Error fetching invoice number:', error);
        res.status(500).send('Error fetching invoice number');
    }
});


client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

async function sendWhatsAppMessages(mobile, pdfName, billName, amt) {
    const phoneNumber = "91" + mobile + "@c.us";
    const attachmentPath = join('/Users/vikii/Downloads', pdfName);
    insertBillData(mobile, pdfName, billName, amt, attachmentPath);
    try {
        const resolvedAttachmentPath = resolve(attachmentPath);

        // Create a MessageMedia instance from the local file path
        const media = MessageMedia.fromFilePath(resolvedAttachmentPath);

        // Modify the filename before sending
        media.filename = 'Thanks for visit us 😊';

        await client.sendMessage(phoneNumber, media);
        console.log(`Sent attachment to ${phoneNumber}`);
        console.log("-------------------------------");
        await markMessageAsSent(mobile, attachmentPath);
    } catch (err) {
        console.error(`Error sending message to ${phoneNumber}:`, err);
    }
}
async function markMessageAsSent(mobile, pdfLocation) {
    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root@123",
            database: "mr_etiqute",
        });

        const query = `UPDATE bill SET isSent = '1' WHERE mobile = ? AND pdf_location = ?`;

        await connection.execute(query, [mobile, pdfLocation]);

        console.log('${mobile} Message marked as sent in the database');
    } catch (error) {
        console.error("Error ${mobile} marking message as sent:", error);
        throw error;
    }
}
async function insertBillData(mobile, pdfName, billName, amt, attachmentPath) {
    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root@123",
            database: "mr_etiqute",
        });

        const query = `INSERT INTO bill (mobile, name, total_amount, pdf_location) 
                       VALUES (?, ?, ?, ?)`;

        await connection.execute(query, [mobile, billName, amt, attachmentPath]);

        console.log(' ${mobile} Data inserted into bill table');
    } catch (error) {
        console.error("Error ${mobile} inserting data into bill table:", error);
        throw error;
    }
}
async function getInvoiceNumber() {
    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root@123",
            database: "mr_etiqute",
        });

        const [rows] = await connection.execute(
            "SELECT id FROM bill  ORDER BY id DESC LIMIT 1"
        );

        if (rows.length > 0) {
            return rows[0].id;
        } else {
            throw "no invoice id number"; // Adjust the response if no invoice is found
        }
    } catch (error) {
        console.error("Error fetching invoice number:", error);
        throw error;
    }
}


client.on('ready', async () => {
    console.log('Client is ready!');
});

client.on('remote_session_saved', async () => {
    console.log('Saved session');
});

client.initialize();

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
