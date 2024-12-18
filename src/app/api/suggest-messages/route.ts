import { google } from '@ai-sdk/google'; // Import Gemini SDK
import { streamText } from 'ai'; // Import the streamText function from AI SDK
import { NextResponse } from 'next/server'; // Import NextResponse for API handling

export const runtime = 'edge';
export const maxDuration = 30; // Set max duration for streaming responses to 30 seconds

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error('Gemini API Key is missing from environment variables');
}

export async function GET(req: Request) {
  try {
    const prompt = 
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: google('gemini-1.0-pro', { apiKey: geminiApiKey }),
      messages: [{ role: 'system', content: prompt }],
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred: ' + error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
