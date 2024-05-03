import express from 'express';
import cors from 'cors';
import { main } from './assistant.js';

const app = express();
const port = 3000;

app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error('API key is not set in the environment variables.');
    process.exit(1); // Exit if no API key is found
}

const allowedOrigins = ['https://academy.europa.eu', 'http://localhost:6640', 'https://olschatbot.site', 'http://hairdresser-ai.s3-website.eu-central-1.amazonaws.com'];

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' +
                      'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    next();
});

app.use(express.static('public'));

app.get('/activate-assistant', async (req, res) => {
    const userInput = req.query.input;
    if (!userInput) {
        res.status(400).send("No input provided");
        return;
    }
    console.log("Received user input:", userInput);
    try {
        const response = await main(userInput);
        console.log("AI Response:", response);
        res.send(response);
    } catch (error) {
        console.error("Error during processing:", error);
        res.status(500).send("Error processing request: " + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
