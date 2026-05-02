import { Request, Response, NextFunction } from 'express';
import { sendSuccessResponse } from '../utils/helpers';

class ExternalController {
  /**
   * GET /api/external/status
   * A public endpoint that returns the current server status and time.
   * This endpoint is unauthenticated and CORS-free.
   */
  async getStatus(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const statusData = {
        status: 'online',
        message: 'Public API is accessible',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      sendSuccessResponse(res, statusData);
    } catch (error) {
      next(error);
    }
  }
}

export default new ExternalController();
