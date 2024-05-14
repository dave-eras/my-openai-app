import OpenAI from "openai";
const openai = new OpenAI();
 
async function main(userInput) { 
  const assistant = await openai.beta.assistants.create({
    name: "Kitty",
    instructions: "You are a female hairdresser. Ask and answer questions about the type of hairstyle your customer would like. You only understand and speak English. But your customer is a learner of English, so keep each response very simple and use a maximum of 20 words.",
    model: "gpt-4o"
  });
}

const thread = await openai.beta.threads.create();

const message = await openai.beta.threads.messages.create(
    thread.id,
    {
      role: "user",
      content: userInput
    }
  );

let run = await openai.beta.threads.runs.createAndPoll(
    thread.id,
    { 
      assistant_id: assistant.id,
      instructions: "Please address the user as 'sweetheart'."
    }
  );

if (run.status === 'completed') {
  const messages = await openai.beta.threads.messages.list(
    run.thread_id
  );
  for (const message of messages.data.reverse()) {
    console.log(`${message.role} > ${message.content[0].text.value}`);
  }
} else {
  console.log(run.status);
}
main();