import { model, Schema } from 'mongoose';
import { IStreak } from '../types/models';
import { requiredString, requiredObjectId } from '../utils/models';

export const StreakSchema: Schema = new Schema(
  {
    user: requiredString,
    goal: {
      ref: 'Goal',
      ...requiredObjectId,
    },
    consecutiveDays: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const StreakModel = model<IStreak>('Streak', StreakSchema);

export default StreakModel;
