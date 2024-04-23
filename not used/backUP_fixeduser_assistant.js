import OpenAI from "openai";

const openai = new OpenAI();

async function main() {  // Remove userInput parameter if not used
    const assistantId = "asst_T2OQSDgcJmAEV1qnpjLnEIzw";
    try {
        const thread = await openai.beta.threads.create();
        console.log("Thread created:", thread.id);
        const message = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: "Hello. My hair looks lovely today, doesn't it?"  // Fixed input
        });
        console.log("Message sent:", message.id);

        const run = await openai.beta.threads.runs.stream(thread.id, {
            assistant_id: assistantId,
            instructions: "Address the user as 'Sir David' as often as possible."
        });

        return new Promise((resolve, reject) => {
            let fullResponse = "";
            run.on('textDelta', (textDelta) => {
                fullResponse += textDelta.value;
            });

            run.on('end', () => {
                console.log("Run completed");
                resolve(fullResponse);
            });

            run.on('error', (error) => {
                console.log("Error in run:", error);
                reject(error);
            });
        });
    } catch (error) {
        console.error("Error in main function:", error);
        throw error;
    }
}

export { main };
