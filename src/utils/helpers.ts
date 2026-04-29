/**
 * @fileoverview Utility helper functions used across the backend.
 * Contains reusable logic for response formatting, validation, etc.
 */

import { Response } from 'express';
import { PaginatedResponse, ApiResponse, ErrorResponse } from '../types';

/**
 * Send a successful paginated response.
 * Standardizes all list endpoints to return consistent pagination metadata.
 */
export function sendPaginatedResponse<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): void {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
  res.status(200).json(response);
}

/**
 * Send a successful single-item response.
 */
export function sendSuccessResponse<T>(res: Response, data: T): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  res.status(200).json(response);
}

/**
 * Send an error response with consistent structure.
 * @param statusCode - HTTP status code (400, 404, 500, etc.)
 * @param message - Human-readable error message
 * @param details - Optional technical details (only shown in development)
 */
export function sendErrorResponse(
  res: Response,
  statusCode: number,
  message: string,
  details?: string
): void {
  const response: ErrorResponse = {
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
  };
  res.status(statusCode).json(response);
}

/**
 * Parse and validate pagination parameters from query string.
 * Provides sensible defaults and caps to prevent abuse.
 */
export function parsePaginationParams(query: any): { page: number; limit: number; offset: number } {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 12));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Validate that a string is a valid UUID format.
 * Used to validate college IDs before DB queries.
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Sanitize search input to prevent injection.
 * Strips special characters that could interfere with text search.
 */
export function sanitizeSearchQuery(query: string): string {
  return query.replace(/[^\w\s.-]/gi, '').trim();
}
