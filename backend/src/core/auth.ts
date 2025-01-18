import { verifyJWTToken } from './jwt';
import type { Request, Response, NextFunction } from 'express';

export const requireAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized access' });
    return;
  }

  const token = authorization.split(' ')[1];

  try {
    const payload = await verifyJWTToken(token);

    const { method, originalUrl } = req;
    const isAppointmentRoute = originalUrl.includes('/appointments');
    const isReviewRoute = originalUrl.includes('/reviews');

    const shouldAddCustomerId =
      isAppointmentRoute ||
      (['POST', 'DELETE'].includes(method) && isReviewRoute);

    if (shouldAddCustomerId) {
      req.body.customerId = Number(payload.sub);
    }

    next();
  } catch (err: any) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
