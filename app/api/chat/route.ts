import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    // Extract the messages from the body of the request
    const { messages } = await req.json();

    // Use streamText from the AI SDK to generate a response
    const result = streamText({
        model: groq('llama-3.1-8b-instant'), // You can change to a different model if needed
        system: 'You are a helpful medical assistant for Sodo Hospital. Provide accurate, professional, and compassionate responses to healthcare-related questions.',
        messages,
    });

    // Return the stream as a response
    return result.toDataStreamResponse();
}
