/**
 * @fileoverview Global error handling middleware.
 * Catches all unhandled errors and formats them into consistent API responses.
 * This prevents the server from crashing on unexpected errors.
 */

import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/helpers';

/**
 * Global error handler middleware.
 * Must be registered AFTER all routes in Express.
 * Catches errors thrown by controllers/services and returns a clean JSON response.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('❌ Unhandled Error:', err.message);
  console.error(err.stack);

  sendErrorResponse(
    res,
    500,
    'Internal Server Error',
    err.message
  );
}

/**
 * 404 Not Found handler.
 * Catches requests to undefined routes.
 */
export function notFoundHandler(_req: Request, res: Response): void {
  sendErrorResponse(res, 404, 'Route not found');
}
