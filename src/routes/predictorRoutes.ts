/**
 * @fileoverview Predictor Routes - Defines the predictor tool API endpoints.
 *
 * Routes:
 * GET  /api/predictor/exams   → List available exams
 * POST /api/predictor/predict → Predict colleges by exam + rank
 */

import { Router } from 'express';
import predictorController from '../controllers/predictorController';
import { validatePredictorRequest } from '../middleware/validator';

const router = Router();

// List all available exams for the dropdown
router.get('/exams', predictorController.getExams.bind(predictorController));

// Predict colleges based on exam and rank
router.post('/predict', validatePredictorRequest, predictorController.predict.bind(predictorController));

export default router;
