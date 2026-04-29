/**
 * @fileoverview College Routes - Defines all college-related API endpoints.
 *
 * Routes:
 * GET  /api/colleges          → List colleges (paginated, searchable, filterable)
 * GET  /api/colleges/featured → Featured colleges for homepage
 * GET  /api/colleges/:id      → Single college detail page
 * GET  /api/filters/locations → Distinct locations for filter dropdowns
 * GET  /api/filters/courses   → Distinct courses for filter dropdowns
 */

import { Router } from 'express';
import collegeController from '../controllers/collegeController';
import { validateCollegeQuery } from '../middleware/validator';

const router = Router();

// College listing with search, filters, and pagination
// Validation middleware runs BEFORE the controller
router.get('/', validateCollegeQuery, collegeController.getColleges.bind(collegeController));

// Featured colleges — must be BEFORE /:id to avoid "featured" being treated as UUID
router.get('/featured', collegeController.getFeaturedColleges.bind(collegeController));

// Single college detail (with courses, placements, reviews)
router.get('/:id', collegeController.getCollegeById.bind(collegeController));

export default router;
