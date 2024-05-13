import OpenAI from "openai";

const openai = new OpenAI();

async function main(userInput, threadId) {
    const assistantId = "asst_T2OQSDgcJmAEV1qnpjLnEIzw";

    try {
        // Use the existing threadId instead of creating a new one
        if (!threadId) {
            const thread = await openai.beta.threads.create();
            threadId = thread.id; // Only create a new thread if no threadId is provided
            console.log("Thread created:", threadId); // Log thread creation
        }

        const message = await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: userInput  // Use dynamic input
        });
        console.log("Message sent:", message.id); // Log message sent

        const run = await openai.beta.threads.runs.stream(threadId, {
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
