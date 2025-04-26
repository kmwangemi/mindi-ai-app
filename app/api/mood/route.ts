import connectDB from '@/lib/mongodb';
import MoodEntry, { IMoodEntry } from '@/models/MoodEntry';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // For simplicity we're getting all entries
    // In a real app, you'd want to filter by userId and add pagination
    const moodEntries = await MoodEntry.find({}).sort({ date: -1 });
    return NextResponse.json({ moodEntries }, { status: 200 });
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mood entries' },
      { status: 500 },
    );
  }
}

interface MoodEntryRequest {
  mood: number;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data: MoodEntryRequest = await request.json();
    // In a real app, you'd get the userId from authentication
    // Here we're just using a temporary placeholder
    const userId = 'user123';
    const moodEntry = await MoodEntry.create({
      date: new Date(),
      mood: data.mood,
      notes: data.notes || '',
      userId: userId,
    });
    return NextResponse.json({ moodEntry }, { status: 201 });
  } catch (error) {
    console.error('Error creating mood entry:', error);
    return NextResponse.json(
      { error: 'Failed to create mood entry' },
      { status: 500 },
    );
  }
}
