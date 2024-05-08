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


app.options('*', cors(corsOptions));  // Now correctly configured to respond to pre-flight checks with credentials allowed

app.get('/activate-assistant', async (req, res) => {
    // Example response to ensure no syntax errors and function body isn't empty
    res.status(200).send('Activate Assistant Endpoint is working!');
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
    console.log('HTTP Server running on port 80');});

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
