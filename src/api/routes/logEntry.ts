import { Router } from 'express';
import GoalModel from '../../models/goal';
import LogEntryModel from '../../models/logEntry';
import StreakModel from '../../models/streak';

const router = Router();

/**
 * Create a log entry
 */
router.post(
  '/users/:userId/goals/:goalId/log-entries',
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const { goalId, userId } = req.params;

      const currentDay = new Date();
      const previousDay = currentDay.setDate(currentDay.getDate() - 1);

      const previousConsecutiveEntry = await LogEntryModel.findOne({
        user: userId,
        goal: goalId,
        createdAt: new Date(previousDay),
      });

      // continue ongoing streak
      if (previousConsecutiveEntry) {
        const session = await LogEntryModel.startSession();

        await session.withTransaction(async () => {
          const [newEntry] = await Promise.all([
            LogEntryModel.create(
              {
                user: userId,
                goal: goalId,
                streak: previousConsecutiveEntry.streak,
              },
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
          ]);

          res.json({
            logEntry: newEntry,
          });
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

// /**
//  * Get list of user's streaks
//  */
// router.get('/:userId/streaks', async (req, res, next) => {
//   try {
//     const { userId } = req.params;

//     const streaks = await StreakModel.find({
//       user: userId,
//     });

//     res.json({
//       streaks,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// /**
//  * Get details of a streak
//  */
// router.get('/streaks/:streakId', async (req, res, next) => {
//   try {
//     const { streakId } = req.params;

//     const streak = await StreakModel.findOne({
//       _id: streakId,
//     });

//     if (!streak) {
//       res.status(404);

//       throw new Error('Streak not found');
//     }

//     res.json({
//       streak,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// /**
//  * Update a streak
//  */
// router.put('/streaks/:streakId', async (req, res, next) => {
//   try {
//     const { streakId } = req.params;
//     const { name } = req.body;

//     const updatedStreak = await StreakModel.findOneAndUpdate(
//       {
//         _id: streakId,
//       },
//       {
//         name,
//       },
//       {
//         new: true,
//       }
//     );

//     if (!updatedStreak) {
//       res.status(404);

//       throw new Error('Streak not found');
//     }

//     res.json({
//       streak: updatedStreak,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// /**
//  * Delete a streak
//  */
// router.delete('/streaks/:streakId', async (req, res, next) => {
//   try {
//     const { streakId } = req.params;

//     const deletedStreak = await StreakModel.findOneAndDelete({
//       _id: streakId,
//     });

//     if (!deletedStreak) {
//       res.status(404);

//       throw new Error('Streak not found');
//     }

//     res.json({
//       streak: deletedStreak,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

export default router;
