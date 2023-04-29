import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import mysql from "mysql2/promise"; // import the mysql2 library for connecting to MySQL
const { Client } = pkg;

const client = new Client({
    puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", async () => { // Use async/await to connect to MySQL before sending messages
    console.log("Client is ready!");
    const phoneNumbers = [];
    const messages = [];

    // Connect to MySQL and fetch phone numbers and messages from a table
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root@123",
        database: "whatsapp_auto_cannon",
    });

    const [rows] = await connection.execute("SELECT * FROM phone_numbers");

    rows.forEach((row) => {
        phoneNumbers.push(row.phone_number + "@c.us");
        messages.push(row.message);
    });

    connection.end(); // Close the MySQL connection

    // Send messages to each phone number with delay of 2 seconds between each message
    phoneNumbers.forEach((phoneNumber, index) => {
        const message = messages[index];

        setTimeout(() => {
            client.sendMessage(phoneNumber, message);
            console.log(`Processing number ${index + 1} of ${phoneNumbers.length}: ${phoneNumber}`);
            console.log(`Sent message to ${phoneNumber}`);
            console.log("-------------------------------");
        }, (index + 1) * 2000); // delay in milliseconds
    });
});

client.on("remote_session_saved", async () => {
    console.log("Saved session");
});

client.initialize();
