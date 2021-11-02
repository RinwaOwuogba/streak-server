import { Router } from 'express';
import startOfYesterday from 'date-fns/startOfYesterday';
import startOfToday from 'date-fns/startOfToday';
import { FilterQuery } from 'mongoose';
import GoalModel from '../../models/goal';
import LogEntryModel from '../../models/logEntry';
import StreakModel from '../../models/streak';
import { ILogEntry } from '../../types/models';

const router = Router();

/**
 * Create a log entry
 */
router.post(
  '/users/:userId/goals/:goalId/log-entries',
  async (req, res, next) => {
    try {
      const { description } = req.body;
      const { goalId, userId } = req.params;

      const [previousConsecutiveEntry, duplicateEntry, existingGoal] =
        await Promise.all([
          LogEntryModel.findOne({
            user: userId,
            goal: goalId,
            createdAt: {
              $gte: startOfYesterday(),
              $lt: startOfToday(),
            },
          }),
          LogEntryModel.findOne({
            user: userId,
            goal: goalId,
            createdAt: {
              $gte: startOfToday(),
            },
          }),
          GoalModel.findOne({
            _id: goalId,
          }),
        ]);

      if (!existingGoal) {
        res.status(404);

        throw new Error('Goal not found');
      }

      if (duplicateEntry) {
        res.status(400);

        throw new Error('Duplicate entry');
      }

      const session = await LogEntryModel.startSession();

      let newEntry;

      // continue ongoing streak
      if (previousConsecutiveEntry) {
        await session.withTransaction(async () => {
          const result = await Promise.all([
            LogEntryModel.create(
              [
                {
                  user: userId,
                  goal: goalId,
                  streak: previousConsecutiveEntry.streak,
                  description,
                },
              ],
              {
                session,
              }
            ),
            GoalModel.updateOne(
              {
                _id: goalId,
              },
              {
                $inc: {
                  ongoingStreak: 1,
                },
              },
              {
                session,
              }
            ),
            StreakModel.updateOne(
              {
                _id: previousConsecutiveEntry.streak as string,
              },
              {
                $inc: {
                  consecutiveDays: 1,
                },
              },
              {
                session,
              }
            ),
          ]);

          newEntry = result[0][0];
          const [, goalUpdate, streakUpdate] = result;

          if (
            goalUpdate.modifiedCount !== 1 ||
            streakUpdate.modifiedCount !== 1
          )
            throw new Error('Unable to create new entry');
        });
      } else {
        // otherwise start a new streak
        await session.withTransaction(async () => {
          const [newStreak] = await StreakModel.create(
            [
              {
                user: userId,
                goal: goalId,
              },
            ],
            {
              session,
            }
          );

          const result = await Promise.all([
            LogEntryModel.create(
              [
                {
                  user: userId,
                  goal: goalId,
                  streak: newStreak.id,
                  description,
                },
              ],
              {
                session,
              }
            ),
            GoalModel.updateOne(
              {
                _id: goalId,
              },
              {
                ongoingStreak: 1,
              },
              {
                session,
              }
            ),
          ]);

          const [, goalUpdate] = result;
          newEntry = result[0][0];

          if (goalUpdate.modifiedCount !== 1)
            throw new Error('Unable to create new entry');
        });
      }

      await session.endSession();

      res.json({
        logEntry: newEntry,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get list of a user's log entries for a particular
 * goal
 */
router.get(
  '/users/:userId/goals/:goalId/log-entries',
  async (req, res, next) => {
    const { userId, goalId } = req.params;
    const { limit, skip, startDate, endDate } = req.query;

    const filterQuery: FilterQuery<ILogEntry> = {
      user: userId,
      goal: goalId,
    };

    if (startDate) {
      filterQuery.createdAt = {
        ...filterQuery.createdAt,
        $gt: new Date(startDate as string),
      };
    }

    if (endDate) {
      filterQuery.createdAt = {
        ...filterQuery.createdAt,
        $lt: new Date(endDate as string),
      };
    }

    try {
      const logEntries = await LogEntryModel.find(
        filterQuery,
        {},
        {
          limit: Number(limit),
          skip: Number(skip),
        }
      );

      res.json({ logEntries });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
