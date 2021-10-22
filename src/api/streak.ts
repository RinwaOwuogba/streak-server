import { Router } from 'express';
import StreakModel from '../models/streak';

const router = Router();

/**
 * Create a streak
 */
router.post('/streaks', async (req, res, next) => {
  try {
    const { name, user } = req.body;

    const newStreak = await StreakModel.create({
      name,
      user,
    });

    res.json({
      streak: newStreak,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get list of user's streaks
 */
router.get('/:userId/streaks', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const streaks = await StreakModel.find({
      user: userId,
    });

    if (!streaks.length) {
      res.status(404);

      throw new Error('Streak not found');
    }

    res.json({
      streaks,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get details of a streak
 */
router.get('/streaks/:streakId', async (req, res, next) => {
  try {
    const { streakId } = req.params;

    const streak = await StreakModel.findOne({
      _id: streakId,
    });

    if (!streak) {
      res.status(404);

      throw new Error('Streak not found');
    }

    res.json({
      streak,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update a streak
 */
router.put('/streaks/:streakId', async (req, res, next) => {
  try {
    const { streakId } = req.params;
    const { name } = req.body;

    const updatedStreak = await StreakModel.findOneAndUpdate(
      {
        _id: streakId,
      },
      {
        name,
      },
      {
        new: true,
      }
    );

    if (!updatedStreak) {
      res.status(404);

      throw new Error('Streak not found');
    }

    res.json({
      streak: updatedStreak,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete a streak
 */
router.delete('/streaks/:streakId', async (req, res, next) => {
  try {
    const { streakId } = req.params;

    const deletedStreak = await StreakModel.findOneAndDelete({
      _id: streakId,
    });

    if (!deletedStreak) {
      res.status(404);

      throw new Error('Streak not found');
    }

    res.json({
      streak: deletedStreak,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
