import { Router } from 'express';
import cors from 'cors';
import externalController from '../controllers/externalController';

const router = Router();

/**
 * Public route that allows cross-origin requests from any site.
 * No authentication required.
 */
router.get('/status', cors(), externalController.getStatus.bind(externalController));

export default router;
