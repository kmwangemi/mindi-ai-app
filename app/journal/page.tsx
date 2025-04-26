"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Book, Calendar, Edit, Trash2 } from "lucide-react"

type JournalEntry = {
  id: string
  title: string
  content: string
  date: Date
}

// Mock data for demonstration
const mockJournalEntries: JournalEntry[] = [
  {
    id: "1",
    title: "Reflecting on my progress",
    content:
      "Today I took some time to reflect on how far I've come in managing my anxiety. I've been practicing mindfulness daily and it's starting to make a difference in how I respond to stressful situations.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Difficult conversation",
    content:
      "Had a challenging conversation with my manager today. I was nervous about it, but I used the breathing techniques I've been practicing and managed to stay calm throughout.",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
]

export default function JournalPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries)
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSaveEntry = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your journal entry.",
        variant: "destructive",
      })
      return
    }

    if (editingId) {
      // Update existing entry
      setJournalEntries(
        journalEntries.map((entry) =>
          entry.id === editingId ? { ...entry, title, content, date: new Date() } : entry,
        ),
      )
      setEditingId(null)
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title,
        content,
        date: new Date(),
      }
      setJournalEntries([newEntry, ...journalEntries])
    }

    setTitle("")
    setContent("")
    setIsCreating(false)

    toast({
      title: editingId ? "Entry updated" : "Entry created",
      description: editingId ? "Your journal entry has been updated." : "Your journal entry has been saved.",
    })
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setTitle(entry.title)
    setContent(entry.content)
    setEditingId(entry.id)
    setIsCreating(true)
  }

  const handleDeleteEntry = (id: string) => {
    setJournalEntries(journalEntries.filter((entry) => entry.id !== id))
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been deleted.",
    })
  }

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setEditingId(null)
    setIsCreating(false)
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Journal</h1>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        )}
      </div>

      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Entry" : "New Journal Entry"}</CardTitle>
            <CardDescription>Express your thoughts and feelings in a safe, private space</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your entry a title"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1">
                  Journal Entry
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts here..."
                  className="min-h-[200px]"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEntry}>{editingId ? "Update Entry" : "Save Entry"}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : journalEntries.length > 0 ? (
        <div className="space-y-4">
          {journalEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{entry.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="mr-1 h-3 w-3" />
                      {entry.date.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditEntry(entry)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEntry(entry.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Book className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No journal entries yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start writing your thoughts and feelings to track your mental wellbeing.
            </p>
            <Button onClick={() => setIsCreating(true)}>Create Your First Entry</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
