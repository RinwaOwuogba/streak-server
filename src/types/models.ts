import mongoose from 'mongoose';

export interface IStreak extends Document {
  _id: string | mongoose.Types.ObjectId;
  user: string;
  name: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface ILogEntry extends Document {
  _id: string | mongoose.Types.ObjectId;
  streak: string | mongoose.Types.ObjectId | Partial<IStreak>;
  content: string;
  updatedAt: Date;
  createdAt: Date;
}
