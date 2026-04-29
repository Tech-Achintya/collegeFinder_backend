/**
 * @fileoverview Request validation middleware using express-validator.
 * Provides reusable validation chains for different API endpoints.
 * Keeps controllers clean by moving validation logic here.
 */

import { query, body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendErrorResponse } from '../utils/helpers';

/**
 * Generic validation result checker.
 * Run this after validation chains to check for errors and return 400 if any.
 */
export function handleValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((e) => e.msg).join(', ');
    sendErrorResponse(res, 400, 'Validation Error', errorMessages);
    return;
  }
  next();
}

/**
 * Validation rules for college listing query parameters.
 * All params are optional but validated when present.
 */
export const validateCollegeQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('search').optional().isString().trim().isLength({ max: 100 }).withMessage('Search query too long'),
  query('state').optional().isString().trim(),
  query('city').optional().isString().trim(),
  query('course').optional().isString().trim(),
  query('min_fees').optional().isNumeric().withMessage('min_fees must be a number'),
  query('max_fees').optional().isNumeric().withMessage('max_fees must be a number'),
  query('sort_by').optional().isIn(['rating', 'name', 'fees']).withMessage('Invalid sort field'),
  query('sort_order').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  handleValidationErrors,
];

/**
 * Validation rules for comparing colleges.
 * Requires an array of 2-3 valid UUIDs.
 */
export const validateCompareRequest = [
  body('college_ids')
    .isArray({ min: 2, max: 3 })
    .withMessage('Must provide 2-3 college IDs for comparison'),
  body('college_ids.*')
    .isUUID()
    .withMessage('Each college ID must be a valid UUID'),
  handleValidationErrors,
];

/**
 * Validation rules for the predictor tool.
 * Requires exam_id (UUID) and rank (positive integer).
 */
export const validatePredictorRequest = [
  body('exam_id').isUUID().withMessage('exam_id must be a valid UUID'),
  body('rank').isInt({ min: 1 }).withMessage('Rank must be a positive integer'),
  handleValidationErrors,
];
