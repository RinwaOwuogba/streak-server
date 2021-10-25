import { model, Schema } from 'mongoose';
import { ILogEntry } from '../types/models';
import { requiredObjectId, requiredString } from '../utils/models';

export const LogEntrySchema: Schema = new Schema(
  {
    user: requiredString,
    streak: {
      ref: 'Streak',
      ...requiredObjectId,
    },
    content: requiredString,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const LogEntryModel = model<ILogEntry>('LogEntry', LogEntrySchema);

export default LogEntryModel;
