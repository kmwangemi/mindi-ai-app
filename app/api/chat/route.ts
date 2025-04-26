import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { NextResponse } from "next/server"

// Define the message type
type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Check if we have messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    // Get the last user message
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()

    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 })
    }

    // Check for crisis keywords
    const crisisKeywords = [
      "suicide",
      "kill myself",
      "end my life",
      "want to die",
      "harm myself",
      "self harm",
      "hurt myself",
      "no reason to live",
      "better off dead",
      "can't go on",
    ]

    const messageText = lastUserMessage.content.toLowerCase()
    const isCrisis = crisisKeywords.some((keyword) => messageText.includes(keyword))

    // Format messages for the AI
    const formattedMessages: Message[] = [
      {
        role: "system",
        content: `You are a compassionate mental health assistant designed to provide emotional support.
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
              : ""
          }
        `,
      },
      ...messages.filter((m) => m.role === "user" || m.role === "assistant"),
    ]

    // Generate response using Groq with the AI SDK
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 500,
    })

    return NextResponse.json({
      response: text,
      isCrisis,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
