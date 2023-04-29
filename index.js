import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import csv from "csv-parser";
import fs from "fs";
const { Client } = pkg;

const client = new Client({
	puppeteer: {
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	},
});

client.on("qr", (qr) => {
	qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
	console.log("Client is ready!");
	const phoneNumbers = [];
	const messages = [];

	// Read phone numbers and messages from CSV file
	fs.createReadStream("messages.csv")
		.pipe(csv())
		.on("data", (data) => {
			phoneNumbers.push(data.phoneNumber + "@c.us");
			messages.push(data.message);
		})
		.on("end", () => {
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
});


client.on("remote_session_saved", async () => {
	console.log("Saved session");
});

client.initialize();
