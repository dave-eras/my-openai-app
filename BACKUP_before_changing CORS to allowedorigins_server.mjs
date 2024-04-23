import express from 'express';
import cors from 'cors';
import { main } from './assistant.js';

const app = express();
const port = 3000;

const corsOptions = {
    origin: ['https://academy.europa.eu', 'http://localhost:6640'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.static('public'));

app.get('/activate-assistant', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://academy.europa.eu');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const userInput = req.query.input; // Get user input from query parameters
    if (!userInput) {
        res.status(400).send("No input provided");
        return;
    }
    console.log("Received user input:", userInput); // Confirm input is received as expected
    try {
        const response = await main(userInput);
        console.log("AI Response:", response); // Log AI response for debugging
        res.send(response);
    } catch (error) {
        console.error("Error during processing:", error);
        res.status(500).send("Error processing request: " + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
