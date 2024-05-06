import express from 'express';
import http from 'http';
import cors from 'cors';
import { main } from './assistant.js';

const app = express();
const corsOptions = {
    origin: 'https://olschatbot.site',  // This ensures only requests from this origin are allowed.
    optionsSuccessStatus: 200  // Some legacy browsers (IE11, various SmartTVs) choke on 204.
};

app.use(cors(corsOptions));

// Your existing routes
app.get('/activate-assistant', async (req, res) => {
    const userInput = req.query.input;
    if (!userInput) {
        res.status(400).send("No input provided");
        return;
    }
    try {
        // Your logic here
        res.send("Response from API");
    } catch (error) {
        console.error("Error during processing:", error);
        res.status(500).send("Error processing request: " + error.message);
    }
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
