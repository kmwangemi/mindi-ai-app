"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import MoodChart from "@/components/mood-chart"
import MoodSelector from "@/components/mood-selector"
import { MoodEntryClient } from "@/types"

type MoodEntry = {
  id: string
  date: Date
  mood: number // 1-5 scale
  notes: string
}

export default function MoodTrackerPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntryClient[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch mood entries when the component mounts
  useEffect(() => {
    fetchMoodEntries();
  }, []);

  const fetchMoodEntries = async () => {
    try {
      const response = await fetch('/api/mood');
      if (!response.ok) {
        throw new Error('Failed to fetch mood entries');
      }
      const data = await response.json();
      // Format the dates from strings to Date objects
      const formattedEntries: MoodEntryClient[] = data.moodEntries.map(
        (entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: entry.createdAt ? new Date(entry.createdAt) : undefined,
          updatedAt: entry.updatedAt ? new Date(entry.updatedAt) : undefined,
        }),
      );
      setMoodEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your mood history.',
        variant: 'destructive',
      });
    }
  };

  const handleMoodSubmit = async () => {
    if (selectedMood === null) {
      toast({
        title: 'Please select a mood',
        description: "Select how you're feeling today before submitting.",
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: selectedMood,
          notes: notes,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save mood entry');
      }
      // Clear form and refresh data
      setSelectedMood(null);
      setNotes('');
      await fetchMoodEntries();
      toast({
        title: 'Mood logged',
        description: 'Your mood has been recorded successfully.',
      });
    } catch (error) {
      console.error('Error saving mood entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your mood entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto max-w-4xl'>
      <h1 className='text-2xl font-bold mb-6'>Mood Tracker</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
            <CardDescription>
              Track your mood to identify patterns over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MoodSelector
              selectedMood={selectedMood}
              onSelect={setSelectedMood}
            />
            <div className='mt-4'>
              <label htmlFor='notes' className='block text-sm font-medium mb-2'>
                Notes (optional)
              </label>
              <Textarea
                id='notes'
                placeholder="What's contributing to your mood today?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className='min-h-[100px]'
              />
            </div>
            <Button
              onClick={handleMoodSubmit}
              className='w-full mt-4'
              disabled={selectedMood === null || isLoading}
            >
              {isLoading ? 'Saving...' : "Log Today's Mood"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Mood History</CardTitle>
            <CardDescription>
              View your mood patterns over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MoodChart moodEntries={moodEntries.map(entry => ({
              id: entry._id || '', // Provide a fallback empty string for id
              date: entry.date,
              mood: entry.mood,
              notes: entry.notes || '', // Provide a fallback empty string for notes
            }))} />
            <div className='mt-4 space-y-2'>
              <h3 className='text-sm font-medium'>Recent entries:</h3>
              <div className='max-h-[200px] overflow-y-auto space-y-2'>
                {moodEntries.slice(0, 3).map(entry => (
                  <div
                    key={entry._id}
                    className='text-sm p-2 bg-muted rounded-md'
                  >
                    <div className='flex justify-between'>
                      <span className='font-medium'>
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                      <span>Mood: {entry.mood}/5</span>
                    </div>
                    {entry.notes && (
                      <p className='mt-1 text-muted-foreground'>
                        {entry.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
