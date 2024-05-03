import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import cors from 'cors';
import { main } from './assistant.js';

const app = express();

// CORS setup
const allowedOrigins = ['https://academy.europa.eu', 'http://localhost:6640', 'https://olschatbot.site', 'http://hairdresser-ai.s3-website.eu-central-1.amazonaws.com'];
app.use(cors({
    origin: function(origin, callback){
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1){
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Static files middleware
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.send('Hello, world!');
});


app.get('/activate-assistant', async (req, res) => {
    const userInput = req.query.input;
    if (!userInput) {
        res.status(400).send("No input provided");
        return;
    }
    try {
        const response = await main(userInput);
        res.send(response);
    } catch (error) {
        console.error("Error during processing:", error);
        res.status(500).send("Error processing request: " + error.message);
    }
});

// HTTPS server
https.createServer(httpsOptions, app).listen(443, () => {
    console.log('HTTPS Server running on port 443');
});

// HTTP server
http.createServer(app).listen(80, () => {
    console.log('HTTP Server running on port 80');
});

// Another HTTP server on a different port
http.createServer(app).listen(3000, () => {
    console.log('HTTP Server running on port 3000');
});

// Check API Key setup
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error('API key is not set in the environment variables.');
    process.exit(1); // Exit if no API key is found
}
