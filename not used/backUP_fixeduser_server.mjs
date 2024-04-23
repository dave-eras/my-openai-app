import express from 'express';
import cors from 'cors';
import { main } from './assistant.js';

const app = express();
const port = 3000;

const corsOptions = {
    origin: 'https://academy.europa.eu',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.static('public'));

app.get('/activate-assistant', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://academy.europa.eu');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // You should capture userInput from the query if it's intended to be dynamic,
    // or just ignore it if using a fixed value in assistant.js
    try {
        const response = await main(); // call without passing userInput
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
