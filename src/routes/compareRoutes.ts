/**
 * @fileoverview Compare Routes - Defines the comparison API endpoint.
 *
 * Routes:
 * POST /api/compare → Compare 2-3 colleges side by side
 */

import { Router } from 'express';
import compareController from '../controllers/compareController';
import { validateCompareRequest } from '../middleware/validator';

const router = Router();

// Compare colleges — POST because we send an array of IDs in the body
router.post('/', validateCompareRequest, compareController.compareColleges.bind(compareController));

export default router;
