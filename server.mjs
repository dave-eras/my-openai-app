import express from 'express';
import http from 'http';
import cors from 'cors';
import { main } from './assistant.js';

const app = express();

// Define a list of allowed origins
const allowedOrigins = ['https://olschatbot.site', 'http://localhost:6640'];

// Configure CORS dynamically
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
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

const port = process.env.PORT || 3000;
http.createServer(app).listen(port, () => {
    console.log(`HTTP Server running on port ${port}`);
});


// Environment checks
const apiKey = process.env.OPENAI_API_K
