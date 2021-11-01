import { Router } from 'express';
import StreakModel from '../../models/streak';

const router = Router();

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

export default router;
