import OpenAI from "openai";

const openai = new OpenAI();

async function main(userInput) {
    const assistantId = "asst_T2OQSDgcJmAEV1qnpjLnEIzw";
    try {
        const thread = await openai.beta.threads.create();
        console.log("Thread created:", thread.id); // Log thread creation
        const message = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: userInput  // Use dynamic input
        });
        console.log("Message sent:", message.id); // Log message sent

        const run = await openai.beta.threads.runs.stream(thread.id, {
            assistant_id: assistantId,
            instructions: "Address the user as 'beautiful CLL employee' as often as possible."
        });

        return new Promise((resolve, reject) => {
            let fullResponse = "";
            run.on('textDelta', (textDelta) => {
                fullResponse += textDelta.value;
            });

            run.on('end', () => {
                console.log("Run completed"); // Confirm run completion
                resolve(fullResponse);
            });

            run.on('error', (error) => {
                console.log("Error in run:", error); // Log any errors during the run
                reject(error);
            });
        });
    } catch (error) {
        console.error("Error in main function:", error);
        throw error; // Rethrow to catch in server response
    }
}

export { main };
