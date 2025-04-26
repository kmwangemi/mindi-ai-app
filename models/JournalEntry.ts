import mongoose, { Document, Schema } from 'mongoose';

export interface IJournalEntry extends Document {
  title: string;
  content: string;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const JournalEntrySchema = new Schema<IJournalEntry>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for your journal entry'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide content for your journal entry'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent TypeScript errors when accessing models that may not be registered yet
const JournalEntry =
  mongoose.models.JournalEntry ||
  mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);

export default JournalEntry as mongoose.Model<IJournalEntry>;
