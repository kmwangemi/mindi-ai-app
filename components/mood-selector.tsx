"use client"

import { cn } from "@/lib/utils"

interface MoodSelectorProps {
  selectedMood: number | null
  onSelect: (mood: number) => void
}

const moods = [
  { value: 1, emoji: "😢", label: "Very Bad" },
  { value: 2, emoji: "😕", label: "Bad" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Very Good" },
]

export default function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex justify-between items-center">
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onSelect(mood.value)}
          className={cn(
            "flex flex-col items-center p-2 rounded-lg transition-all",
            selectedMood === mood.value ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-muted",
          )}
        >
          <span className="text-3xl mb-1">{mood.emoji}</span>
          <span className="text-xs">{mood.label}</span>
        </button>
      ))}
    </div>
  )
}
