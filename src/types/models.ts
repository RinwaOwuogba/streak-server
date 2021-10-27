import mongoose from 'mongoose';

export interface IGoal extends Document {
  _id: string | mongoose.Types.ObjectId;
  user: string;
  name: string;
  ongoingStreak?: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface IStreak extends Document {
  _id: string | mongoose.Types.ObjectId;
  user: string;
  goal: string;
  consecutiveDays: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface ILogEntry extends Document {
  _id: string | mongoose.Types.ObjectId;
  user: string;
  streak: string | mongoose.Types.ObjectId | Partial<IStreak>;
  goal: string | mongoose.Types.ObjectId | Partial<IStreak>;
  content: string;
  updatedAt: Date;
  createdAt: Date;
}
