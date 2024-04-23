import express from 'express';
import cors from 'cors';
import { main } from './assistant.js';

const app = express();
const port = 3000;  // Set port to 6640
const corsOptions = {
    origin: 'https://academy.europa.eu/',  // Replace with your LMS domain
    optionsSuccessStatus: 200  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  

// Allow CORS for all domains
app.use(cors());

// Serve files from the 'public' directory
app.use(express.static('public'));

app.get('/activate-assistant', cors(corsOptions), async (req, res) => {
    try {
        const response = await main();
        res.send(response);
    } catch (error) {
        console.error("Failed to process request:", error);
        res.status(500).send("Error processing request");
    }
});


app.listen(3000, '0.0.0.0', () => {
    console.log(`Server running on port 3000`);
});
  

