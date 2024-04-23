import OpenAI from "openai";
const openai = new OpenAI();

async function main() { 
    const assistant = await openai.beta.assistants.create({
      name: "Big Sandy",
      instructions: "You are a female hairdresser who has an incredible knowledge of the CEFR scales. You adapt the level of your language dynamically to the level of the user.",
      model: "gpt-4-turbo"
    });

    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
          role: "user",
          content: "My hair looks awful. Can you help me?"
        }
      );

      // We use the stream SDK helper to create a run with
// streaming. The SDK provides helpful event listeners to handle 
// the streamed response.
 
    const run = await openai.beta.threads.runs.stream(thread.id, {
    assistant_id: assistant.id,
    instructions: "Address the user as 'Cum Bucket' as often as possible."
  })
    .on('textCreated', (text) => process.stdout.write('\nassistant > '))
    .on('textDelta', (textDelta, snapshot) => process.stdout.write(textDelta.value))
    .on('toolCallCreated', (toolCall) => process.stdout.write(`\nassistant > ${toolCall.type}\n\n`))
    .on('toolCallDelta', (toolCallDelta, snapshot) => {
      if (toolCallDelta.type === 'code_interpreter') {
        if (toolCallDelta.code_interpreter.input) {
          process.stdout.write(toolCallDelta.code_interpreter.input);
        }
        if (toolCallDelta.code_interpreter.outputs) {
          process.stdout.write("\noutput >\n");
          toolCallDelta.code_interpreter.outputs.forEach(output => {
            if (output.type === "logs") {
              process.stdout.write(`\n${output.logs}\n`);
            }
          });
        }
      }
    });

    console.log(run)
  }


  main();