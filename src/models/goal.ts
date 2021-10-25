import { model, Schema } from 'mongoose';
import { IGoal } from '../types/models';
import { requiredString } from '../utils/models';

export const GoalSchema: Schema = new Schema(
  {
    name: requiredString,
    user: requiredString,
    ongoingStreak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const GoalModel = model<IGoal>('Goal', GoalSchema);

export default GoalModel;
