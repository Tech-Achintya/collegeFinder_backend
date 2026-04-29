/**
 * @fileoverview Predictor Controller - HTTP request handlers for the college predictor tool.
 *
 * Provides two endpoints:
 * 1. GET /api/predictor/exams - List available exams
 * 2. POST /api/predictor/predict - Predict colleges based on exam + rank
 */

import { Request, Response, NextFunction } from 'express';
import predictorService from '../services/predictorService';
import { sendSuccessResponse, sendErrorResponse } from '../utils/helpers';
import { PredictorRequest } from '../types';

class PredictorController {
  /**
   * GET /api/predictor/exams
   * Returns all available exams for the predictor form dropdown.
   */
  async getExams(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const exams = await predictorService.getExams();
      sendSuccessResponse(res, exams);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/predictor/predict
   * Takes exam_id and rank, returns colleges with admission chances.
   *
   * Request body: { exam_id: "uuid", rank: 5000 }
   * Response: Array of PredictorResult objects sorted by admission chance.
   */
  async predict(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { exam_id, rank } = req.body as PredictorRequest;

      const results = await predictorService.predictColleges(exam_id, rank);

      // If no results, return a helpful message
      if (results.length === 0) {
        sendSuccessResponse(res, {
          results: [],
          message: 'No colleges found for the given exam and rank. Try a different exam or adjust your rank.',
        });
        return;
      }

      sendSuccessResponse(res, {
        results,
        total: results.length,
        exam_id,
        rank,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PredictorController();
