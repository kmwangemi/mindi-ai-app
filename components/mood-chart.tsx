"use client"

import { useEffect, useRef } from "react"

type MoodEntry = {
  id: string
  date: Date
  mood: number
  notes: string
}

interface MoodChartProps {
  moodEntries: MoodEntry[]
}

export default function MoodChart({ moodEntries }: MoodChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Sort entries by date
    const sortedEntries = [...moodEntries].sort((a, b) => a.date.getTime() - b.date.getTime())

    // Only show the last 7 entries or fewer
    const entriesToShow = sortedEntries.slice(-7)

    if (entriesToShow.length === 0) return

    // Chart dimensions
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#94a3b8" // slate-400
    ctx.lineWidth = 1

    // X-axis
    ctx.moveTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)

    // Y-axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.stroke()

    // Draw mood points and lines  canvas.height - padding);
    ctx.stroke()

    // Draw mood points and lines
    ctx.beginPath()
    ctx.strokeStyle = "#8b5cf6" // violet-500
    ctx.lineWidth = 2

    // Calculate x and y positions for each data point
    const pointWidth = chartWidth / (entriesToShow.length - 1 || 1)

    entriesToShow.forEach((entry, index) => {
      // Calculate x position
      const x = padding + index * pointWidth

      // Calculate y position (mood is 1-5, we need to invert it for the chart)
      // 5 = top of chart, 1 = bottom of chart
      const normalizedMood = 6 - entry.mood // Invert the scale
      const y = padding + (normalizedMood - 1) * (chartHeight / 4)

      // Draw point
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fillStyle = "#8b5cf6" // violet-500
      ctx.fill()

      // Draw line connecting points
      if (index > 0) {
        const prevEntry = entriesToShow[index - 1]
        const prevNormalizedMood = 6 - prevEntry.mood
        const prevX = padding + (index - 1) * pointWidth
        const prevY = padding + (prevNormalizedMood - 1) * (chartHeight / 4)

        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      // Draw date label
      ctx.fillStyle = "#64748b" // slate-500
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      const dateLabel = entry.date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
      ctx.fillText(dateLabel, x, canvas.height - padding + 15)
    })

    // Draw y-axis labels
    ctx.fillStyle = "#64748b" // slate-500
    ctx.font = "10px sans-serif"
    ctx.textAlign = "right"

    for (let i = 1; i <= 5; i++) {
      const y = padding + (5 - i) * (chartHeight / 4)
      ctx.fillText(i.toString(), padding - 10, y + 3)
    }
  }, [moodEntries])

  return <canvas ref={canvasRef} width={400} height={200} className="w-full h-auto" />
}
