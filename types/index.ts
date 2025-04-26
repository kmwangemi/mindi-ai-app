export interface MoodEntryClient {
  _id?: string;
  date: Date;
  mood: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChartDataPoint {
  date: string;
  mood: number;
}

export interface JournalEntryClient {
  _id?: string;
  title: string;
  content: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
