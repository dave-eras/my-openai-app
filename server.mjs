import express from 'express';
import http from 'http';
import cors from 'cors';
import { main } from './assistant.js';  // Ensure this module exports the 'main' function properly

const app = express();
const corsOptions = {
    origin: 'https://olschatbot.site',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Enables pre-flight across-the-board

// Middleware to parse JSON bodies (assuming your front-end sends JSON data)
app.use(express.json());

app.get('/activate-assistant', async (req, res) => {
    try {
        // Extract userInput from query parameters or body
        const userInput = req.query.input || req.body.input;
        if (!userInput) {
            return res.status(400).json({ error: 'No input provided' });
        }
        
        // Call main function which should handle OpenAI API interaction
        const responseFromOpenAI = await main(userInput);
        res.status(200).json({ response: responseFromOpenAI });
    } catch (error) {
        console.error('Failed to activate assistant:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Custom middleware to handle CORS and credentials on all responses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://olschatbot.site');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Server setup
const port = process.env.PORT || 3000; // Use environment variable or default to 3000
http.createServer(app).listen(port, () => {
    console.log(`HTTP Server running on port ${port}`);
});

// Environment checks
const apiKey = process.env.OPENAI_API_K
