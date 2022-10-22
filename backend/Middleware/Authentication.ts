import { NextFunction, Request, Response } from 'express';

const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return req.isAuthenticated() ? next() : res.status(403).send('Unauthorized');
};

export default ensureAuthenticated;
