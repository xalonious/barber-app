import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.isJoi) {
    return res.status(400).json({
      code: 'VALIDATION_FAILED',
      details: err.details.map((detail: any) => ({
        message: detail.message,
        path: detail.path.join('.'),
      })),
    });
  }

  const statusCode = err.status || 500;
  const response = {
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred.',
  };

  res.status(statusCode).json(response);
};
