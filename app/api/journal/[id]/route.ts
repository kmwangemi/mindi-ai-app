import connectDB from '@/lib/mongodb';
import JournalEntry from '@/models/JournalEntry';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = params;
    const data = await request.json();

    // In a real app, you'd verify the userId matches the authenticated user
    const userId = 'user123';

    const updatedEntry = await JournalEntry.findOneAndUpdate(
      { _id: id, userId },
      {
        title: data.title,
        content: data.content,
        date: new Date(),
      },
      { new: true },
    );

    if (!updatedEntry) {
      return NextResponse.json(
        { error: 'Journal entry not found or not authorized to update' },
        { status: 404 },
      );
    }

    return NextResponse.json({ journalEntry: updatedEntry }, { status: 200 });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to update journal entry' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = params;

    // In a real app, you'd verify the userId matches the authenticated user
    const userId = 'user123';

    const deletedEntry = await JournalEntry.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedEntry) {
      return NextResponse.json(
        { error: 'Journal entry not found or not authorized to delete' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete journal entry' },
      { status: 500 },
    );
  }
}
