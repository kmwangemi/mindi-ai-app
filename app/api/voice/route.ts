import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    // In a real implementation, this would process audio data
    // and return a transcript using a service like Whisper API

    // Mock implementation for demonstration
    const mockTranscripts = [
      "I've been feeling anxious about my upcoming presentation at work.",
      "I'm feeling a bit down today and I'm not sure why.",
      "I had a good day today, but I'm still worried about some things.",
      "I've been having trouble sleeping lately.",
      "I'm feeling overwhelmed with all my responsibilities.",
    ]

    const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)]

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      transcript: randomTranscript,
      success: true,
    })
  } catch (error) {
    console.error("Error in voice API:", error)
    return NextResponse.json({ error: "Failed to process voice input", success: false }, { status: 500 })
  }
}
