import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

// Define the message type
type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Check if we have messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 },
      );
    }

    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 },
      );
    }

    // Check for crisis keywords
    const crisisKeywords = [
      'suicide',
      'kill myself',
      'end my life',
      'want to die',
      'harm myself',
      'self harm',
      'hurt myself',
      'no reason to live',
      'better off dead',
      "can't go on",
    ];

    const messageText = lastUserMessage.content.toLowerCase();
    const isCrisis = crisisKeywords.some(keyword =>
      messageText.includes(keyword),
    );

    // Format system message based on crisis detection
    const systemContent = `You are a compassionate mental health assistant designed to provide emotional support.
      Respond with empathy and understanding. Offer helpful coping strategies when appropriate.
      Do not diagnose or provide medical advice. Instead, focus on supportive listening and validation.
      Keep responses concise (3-4 sentences max) and conversational.
      ${
        isCrisis
          ? `
      IMPORTANT: The user may be expressing thoughts of self-harm or suicide.
      Respond with care and urgency. Acknowledge their feelings without judgment.
      Encourage them to reach out to crisis services immediately.
      Provide the crisis hotline number: 988 or 1-800-273-8255 (US).
      Suggest they visit the Crisis Resources page in the app.
      `
          : ''
      }`;

    // Format all messages for the API
    const formattedMessages = [
      {
        role: 'system',
        content: systemContent,
      },
      ...messages.filter(m => m.role === 'user' || m.role === 'assistant'),
    ];

    // Initialize Groq client
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Make the API call
    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: 'meta-llama/llama-4-scout-17b-16e-instruct', // Using Llama 4 from the first snippet
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      stream: false, // Set to true if you want streaming
    });

    // Extract the response text
    const responseText = chatCompletion.choices[0]?.message?.content || '';

    // Return the response
    return NextResponse.json({
      response: responseText,
      isCrisis,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 },
    );
  }
}
