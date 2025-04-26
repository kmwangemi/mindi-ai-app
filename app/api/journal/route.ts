import connectDB from '@/lib/mongodb';
import JournalEntry, { IJournalEntry } from '@/models/JournalEntry';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // In a real app, you'd get the userId from authentication
    const userId = 'user123';

    const journalEntries = await JournalEntry.find({ userId }).sort({
      date: -1,
    });

    return NextResponse.json({ journalEntries }, { status: 200 });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries' },
      { status: 500 },
    );
  }
}

interface JournalEntryRequest {
  title: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const data: JournalEntryRequest = await request.json();

    // In a real app, you'd get the userId from authentication
    const userId = 'user123';

    const journalEntry = await JournalEntry.create({
      title: data.title,
      content: data.content,
      date: new Date(),
      userId,
    });

    return NextResponse.json({ journalEntry }, { status: 201 });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to create journal entry' },
      { status: 500 },
    );
  }
}
