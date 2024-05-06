import express from 'express';
import http from 'http';
import cors from 'cors';
import { main } from './assistant.js';

const app = express();
const corsOptions = {
    origin: 'https://olschatbot.site',  // Ensures only requests from this origin are allowed
    credentials: true,                 // Allows cookies and credentials to be sent along with the request
    optionsSuccessStatus: 200          // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Enable pre-flight request for all routes
app.options('*', cors(corsOptions));  // Now correctly configured to respond to pre-flight checks with credentials allowed

// Define your routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
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

// Custom middleware to ensure CORS and Credentials are handled on all responses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://olschatbot.site');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true'); // Make sure to set this header
    next();
});

// Set up HTTP server on port 80
http.createServer(app).listen(80, () => {
    console.log('HTTP Server running on port 80');
});

// Also listen on port 3000 for HTTP
http.createServer(app).listen(3000, () => {
    console.log('HTTP Server running on port 3000');
});

// Environment checks
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error('API key is not set in the environment variables.');
    process.exit(1); // Exit if no API key is found
}
