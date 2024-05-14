import OpenAI from "openai";
const openai = new OpenAI();

async function main(userInput) {
    try {
        // Create an assistant
        const assistant = await openai.beta.assistants.create({
            name: "Kitty",
            instructions: "You are a female hairdresser. Ask and answer questions about the type of hairstyle your customer would like. You only understand and speak English. But your customer is a learner of English, so keep each response very simple and use a maximum of 20 words.",
            model: "gpt-4.0"
        });

        // Create a thread
        const thread = await openai.beta.threads.create();

        // Create a message in the thread
        const message = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: userInput
        });

        // Run the assistant and poll for completion
        let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistant.id,
            instructions: "Please address the user as 'sweetheart'."
        });

        if (run.status === 'completed') {
            // List all messages in the thread
            const messages = await openai.beta.threads.messages.list(run.thread_id);
            let fullConversation = '';
            for (const message of messages.data.reverse()) {
                fullConversation += `${message.role} > ${message.content[0].text.value}\n`;
            }
            return fullConversation;
        } else {
            console.log(run.status);
            return `Conversation status: ${run.status}`;
        }
    } catch (error) {
        console.error("Error in main function:", error);
        throw error; // Rethrow to catch in server response
    }
}

export { main };
