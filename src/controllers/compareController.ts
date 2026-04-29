/**
 * @fileoverview Compare Controller - HTTP request handler for college comparison.
 *
 * Handles the POST /api/compare endpoint.
 * Validation is done by middleware (validator.ts) before reaching this controller.
 */

import { Request, Response, NextFunction } from 'express';
import compareService from '../services/compareService';
import { sendSuccessResponse, sendErrorResponse } from '../utils/helpers';
import { CompareRequest } from '../types';

class CompareController {
  /**
   * POST /api/compare
   * Compare 2-3 colleges side by side.
   *
   * Request body: { college_ids: ["uuid1", "uuid2", "uuid3"] }
   * Response: Array of CollegeComparison objects with aggregated metrics.
   */
  async compareColleges(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { college_ids } = req.body as CompareRequest;

      // Check for duplicate IDs
      const uniqueIds = [...new Set(college_ids)];
      if (uniqueIds.length !== college_ids.length) {
        sendErrorResponse(res, 400, 'Duplicate college IDs are not allowed');
        return;
      }

      const comparison = await compareService.compareColleges(uniqueIds);
      sendSuccessResponse(res, comparison);
    } catch (error) {
      // Handle specific "not found" errors from the service
      if (error instanceof Error && error.message.includes('not found')) {
        sendErrorResponse(res, 404, error.message);
        return;
      }
      next(error);
    }
  }
}

export default new CompareController();
