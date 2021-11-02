import { Router } from 'express';
import GoalModel from '../../models/goal';
import LogEntryModel from '../../models/logEntry';
import StreakModel from '../../models/streak';
import checkPermission from '../middlewares/checkPermission';

const router = Router();

/**
 *
 * Create a goal
 */
router.post('/users/:userId/goals', checkPermission, async (req, res, next) => {
  try {
    const { name } = req.body;
    const { userId } = req.params;

    const newGoal = await GoalModel.create({
      name,
      user: userId,
    });

    res.json({
      goal: newGoal,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get list of user's goals
 */
router.get('/users/:userId/goals', checkPermission, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { ongoingStreak } = req.query;

    if (ongoingStreak) {
      const goals = await GoalModel.find(
        {
          user: userId,
          ongoingStreak: {
            $gte: 1,
          },
        },
        null,
        {
          sort: {
            ongoingStreak: -1,
          },
        }
      );

      res.json({
        goals,
      });

      return;
    }

    const goals = await GoalModel.find({
      user: userId,
    });

    res.json({
      goals,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get details of a user's goal
 */
router.get(
  '/users/:userId/goals/:goalId',
  checkPermission,
  async (req, res, next) => {
    try {
      const { goalId, userId } = req.params;

      const goal = await GoalModel.findOne({
        _id: goalId,
        user: userId,
      });

      if (!goal) {
        res.status(404);

        throw new Error('Goal not found');
      }

      res.json({
        goal,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Update a goal
 */
router.put(
  '/users/:userId/goals/:goalId',
  checkPermission,
  async (req, res, next) => {
    try {
      const { goalId, userId } = req.params;
      const { name } = req.body;

      const updatedGoal = await GoalModel.findOneAndUpdate(
        {
          _id: goalId,
          user: userId,
        },
        {
          name,
        },
        {
          new: true,
        }
      );

      if (!updatedGoal) {
        res.status(404);

        throw new Error('Goal not found');
      }

      res.json({
        goal: updatedGoal,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Delete a goal
 */
router.delete(
  '/users/:userId/goals/:goalId',
  checkPermission,
  async (req, res, next) => {
    try {
      const { goalId, userId } = req.params;

      const session = await GoalModel.startSession();

      await session.withTransaction(async () => {
        const [deletedGoal] = await Promise.all([
          GoalModel.findOneAndDelete(
            {
              _id: goalId,
              user: userId,
            },
            {
              session,
            }
          ),
          LogEntryModel.deleteMany(
            {
              user: userId,
              goal: goalId,
            },
            {
              session,
            }
          ),
          StreakModel.deleteMany(
            {
              user: userId,
              goal: goalId,
            },
            {
              session,
            }
          ),
        ]);

        if (!deletedGoal) {
          res.status(404);

          throw new Error('Goal not found');
        }
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
