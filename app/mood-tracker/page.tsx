"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import MoodChart from "@/components/mood-chart"
import MoodSelector from "@/components/mood-selector"

type MoodEntry = {
  id: string
  date: Date
  mood: number // 1-5 scale
  notes: string
}

// Mock data for demonstration
const mockMoodData: MoodEntry[] = [
  { id: "1", date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), mood: 3, notes: "Feeling okay today." },
  { id: "2", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), mood: 2, notes: "Had a difficult day at work." },
  {
    id: "3",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    mood: 4,
    notes: "Spent time with friends, felt good.",
  },
  { id: "4", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), mood: 3, notes: "Normal day, nothing special." },
  { id: "5", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), mood: 5, notes: "Great news today!" },
  {
    id: "6",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    mood: 4,
    notes: "Productive day, feeling accomplished.",
  },
]

export default function MoodTrackerPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(mockMoodData)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [notes, setNotes] = useState("")
  const { toast } = useToast()

  const handleMoodSubmit = () => {
    if (selectedMood === null) {
      toast({
        title: "Please select a mood",
        description: "Select how you're feeling today before submitting.",
        variant: "destructive",
      })
      return
    }

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: selectedMood,
      notes: notes,
    }

    setMoodEntries([...moodEntries, newEntry])
    setSelectedMood(null)
    setNotes("")

    toast({
      title: "Mood logged",
      description: "Your mood has been recorded successfully.",
    })
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Mood Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
            <CardDescription>Track your mood to identify patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />

            <div className="mt-4">
              <label htmlFor="notes" className="block text-sm font-medium mb-2">
                Notes (optional)
              </label>
              <Textarea
                id="notes"
                placeholder="What's contributing to your mood today?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button onClick={handleMoodSubmit} className="w-full mt-4" disabled={selectedMood === null}>
              Log Today's Mood
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Mood History</CardTitle>
            <CardDescription>View your mood patterns over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <MoodChart moodEntries={moodEntries} />

            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium">Recent entries:</h3>
              <div className="max-h-[200px] overflow-y-auto space-y-2">
                {moodEntries
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .slice(0, 3)
                  .map((entry) => (
                    <div key={entry.id} className="text-sm p-2 bg-muted rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">{entry.date.toLocaleDateString()}</span>
                        <span>Mood: {entry.mood}/5</span>
                      </div>
                      {entry.notes && <p className="mt-1 text-muted-foreground">{entry.notes}</p>}
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
