import { model, Schema } from 'mongoose';
import { IStreak } from '../types/models';
import requiredString from '../utils/models';

export const StreakSchema: Schema = new Schema(
  {
    name: requiredString,
    user: requiredString,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const StreakModel = model<IStreak>('Streak', StreakSchema);

export default StreakModel;
