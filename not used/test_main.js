import { main } from './assistant.js';

async function testMain() {
    try {
        const response = await main("Hello");
        console.log("Test response:", response);
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testMain();
