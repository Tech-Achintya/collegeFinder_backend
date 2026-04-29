/**
 * @fileoverview Filter Routes - Dedicated routes for filter dropdown data.
 *
 * These are separated from college routes for cleaner API design.
 * Filter data is cached by the frontend since it rarely changes.
 *
 * Routes:
 * GET /api/filters/locations → Distinct states and cities
 * GET /api/filters/courses   → Distinct course/degree types
 */

import { Router } from 'express';
import collegeController from '../controllers/collegeController';

const router = Router();

// Get distinct locations (states + cities) for filter dropdowns
router.get('/locations', collegeController.getFilterLocations.bind(collegeController));

// Get distinct course types for course filter dropdown
router.get('/courses', collegeController.getFilterCourses.bind(collegeController));

export default router;
