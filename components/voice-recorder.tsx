"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, StopCircle, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void
  onCancel: () => void
}

export default function VoiceRecorder({ onTranscript, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(true)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [isRecording])

  useEffect(() => {
    // Simulate recording for 30 seconds max
    const timeout = setTimeout(() => {
      if (isRecording) {
        handleStopRecording()
      }
    }, 30000)

    return () => {
      clearTimeout(timeout)
    }
  }, [isRecording])

  const handleStopRecording = async () => {
    setIsRecording(false)
    setIsProcessing(true)

    try {
      // In a real implementation, this would send audio data to the server
      // For now, we'll call our mock API endpoint
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audio: "mock_audio_data" }),
      })

      if (!response.ok) {
        throw new Error("Failed to process voice")
      }

      const data = await response.json()
      onTranscript(data.transcript)

      toast({
        title: "Voice recorded",
        description: "Your message has been transcribed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process voice. Please try typing instead.",
        variant: "destructive",
      })
      onCancel()
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="mb-4 p-4 bg-muted rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isRecording ? (
            <Mic className="h-5 w-5 text-destructive animate-pulse" />
          ) : (
            <StopCircle className="h-5 w-5" />
          )}
          <span className="font-medium">{isRecording ? "Recording..." : isProcessing ? "Processing..." : "Ready"}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">{formatTime(recordingTime)}</span>
        {isRecording && (
          <Button variant="secondary" size="sm" onClick={handleStopRecording}>
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  )
}
