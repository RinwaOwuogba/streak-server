import { RequestHandler } from 'express';

const checkPermission: RequestHandler = (req, res, next) => {
  if (req.user?.sub === req.params.userId) return next();

  res.status(403);

  return next(new Error('Forbidden'));
};

export default checkPermission;
