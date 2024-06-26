import express from 'express';
import http from 'http';
import cors from 'cors';
import { main } from './assistant2.js';

const app = express();

// Define a list of allowed origins
const allowedOrigins = ['https://olschatbot.site'];

// Configure CORS dynamically
const corsOptions = {
    origin: function (origin, callback) {
        // Check if the origin is in the allowed list or is any localhost origin
        if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
            callback(null, true); // Allow CORS for this request
        } else {
            callback(new Error('Not allowed by CORS')); // Reject this request
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Enables pre-flight across-the-board

// Middleware to parse JSON bodies (assuming your front-end sends JSON data)
app.use(express.json());

app.get('/activate-assistant', async (req, res) => {
    try {
        const userInput = req.query.input || req.body.input;
        if (!userInput) {
            return res.status(400).json({ error: 'No input provided' });
        }
        
        const responseFromOpenAI = await main(userInput);
        res.status(200).json({ response: responseFromOpenAI });
    } catch (error) {
        console.error('Failed to activate assistant:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Custom middleware to handle CORS and credentials on all responses
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Set the primary port
http.createServer(app).listen(3000, () => {
    console.log('HTTP Server running on port 3000');
});

// Optionally set up server to listen on port 80 as well
http.createServer(app).listen(80, () => {
    console.log('HTTP Server running on port 80');
});

// Environment checks
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error('API key is not set in the environment variables.');
    process.exit(1); // Exit if no API key is found
}
