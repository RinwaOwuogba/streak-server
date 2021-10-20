import { model, Schema } from 'mongoose';
import { ILogEntry } from '../types/models';
import { requiredString } from '../utils/models';

export const LogEntrySchema: Schema = new Schema(
  {
    content: requiredString,
    streak: {
      ref: 'Streak',
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const LogEntryModel = model<ILogEntry>('LogEntry', LogEntrySchema);

export default LogEntryModel;
