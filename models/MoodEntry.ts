import mongoose, { Document, Schema } from 'mongoose';

export interface IMoodEntry extends Document {
  date: Date;
  mood: number;
  notes?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const MoodEntrySchema = new Schema<IMoodEntry>(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    mood: {
      type: Number,
      required: [true, 'Please rate your mood'],
      min: 1,
      max: 5,
    },
    notes: {
      type: String,
      required: false,
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
const MoodEntry =
  mongoose.models.MoodEntry ||
  mongoose.model<IMoodEntry>('MoodEntry', MoodEntrySchema);

export default MoodEntry as mongoose.Model<IMoodEntry>;
