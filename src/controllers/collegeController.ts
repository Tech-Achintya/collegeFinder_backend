/**
 * @fileoverview College Controller - HTTP request handlers for college endpoints.
 *
 * This controller is intentionally thin — it only:
 * 1. Extracts parameters from the request
 * 2. Calls the appropriate service method
 * 3. Sends the response using helper utilities
 *
 * All business logic lives in collegeService.ts.
 */

import { Request, Response, NextFunction } from 'express';
import collegeService from '../services/collegeService';
import { sendPaginatedResponse, sendSuccessResponse, sendErrorResponse, isValidUUID } from '../utils/helpers';
import { CollegeQueryParams } from '../types';

class CollegeController {
  /**
   * GET /api/colleges
   * List colleges with pagination, search, and filters.
   *
   * Query params: page, limit, search, state, city, course, min_fees, max_fees, sort_by, sort_order
   */
  async getColleges(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract and type-cast query parameters
      const params: CollegeQueryParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 12,
        search: req.query.search as string,
        state: req.query.state as string,
        city: req.query.city as string,
        course: req.query.course as string,
        min_fees: req.query.min_fees ? parseFloat(req.query.min_fees as string) : undefined,
        max_fees: req.query.max_fees ? parseFloat(req.query.max_fees as string) : undefined,
        sort_by: req.query.sort_by as CollegeQueryParams['sort_by'],
        sort_order: req.query.sort_order as CollegeQueryParams['sort_order'],
      };

      const { colleges, total } = await collegeService.getColleges(params);
      sendPaginatedResponse(res, colleges, params.page!, params.limit!, total);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/colleges/featured
   * Get featured colleges for the homepage carousel/section.
   */
  async getFeaturedColleges(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const colleges = await collegeService.getFeaturedColleges();
      sendSuccessResponse(res, colleges);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/colleges/:id
   * Get a single college with all related data (courses, placements, reviews).
   */
  async getCollegeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;

      // Validate UUID format before querying DB
      if (!isValidUUID(id)) {
        sendErrorResponse(res, 400, 'Invalid college ID format');
        return;
      }

      const college = await collegeService.getCollegeById(id);

      if (!college) {
        sendErrorResponse(res, 404, 'College not found');
        return;
      }

      sendSuccessResponse(res, college);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/filters/locations
   * Get distinct state and city values for filter dropdowns.
   */
  async getFilterLocations(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locations = await collegeService.getDistinctLocations();
      sendSuccessResponse(res, locations);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/filters/courses
   * Get distinct course/degree types for filter dropdown.
   */
  async getFilterCourses(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courses = await collegeService.getDistinctCourses();
      sendSuccessResponse(res, courses);
    } catch (error) {
      next(error);
    }
  }
}

export default new CollegeController();
