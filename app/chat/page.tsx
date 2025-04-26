"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Send, Loader2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import ChatMessage from "@/components/chat-message"
import VoiceRecorder from "@/components/voice-recorder"
import Link from "next/link"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! How are you feeling today? I'm here to listen and help.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Format messages for the API
      const apiMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      apiMessages.push({
        role: userMessage.role,
        content: userMessage.content,
      })

      // Call the API route with the messages
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to get a response: ${response.status}`)
      }

      const data = await response.json()

      // Check if the message was flagged as a crisis
      if (data.isCrisis) {
        setShowCrisisAlert(true)
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Chat error:", error)
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const handleVoiceInput = (transcript: string) => {
    setInput(transcript)
    setIsRecording(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat with AI Assistant</h1>

      {showCrisisAlert && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-600 dark:text-red-400">Crisis Support Available</h3>
              <p className="text-sm mt-1">
                It sounds like you might be going through a difficult time. Please consider reaching out to a crisis
                support service for immediate help.
              </p>
              <Link href="/crisis-resources">
                <Button variant="destructive" size="sm" className="mt-2">
                  View Crisis Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
              <div>Thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t">
          {isRecording && <VoiceRecorder onTranscript={handleVoiceInput} onCancel={() => setIsRecording(false)} />}

          <div className="flex space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type how you're feeling..."
              className="min-h-[60px] resize-none"
              disabled={isLoading || isRecording}
            />
            <div className="flex flex-col space-y-2">
              <Button
                onClick={toggleRecording}
                size="icon"
                variant={isRecording ? "destructive" : "secondary"}
                disabled={isLoading}
                type="button"
                aria-label={isRecording ? "Stop recording" : "Start voice recording"}
              >
                <Mic className={cn("h-4 w-4", isRecording && "animate-pulse")} />
              </Button>
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={isLoading || !input.trim()}
                type="button"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            This is a safe space. Your conversations are private and not stored permanently.
          </p>
        </div>
      </Card>
    </div>
  )
}
