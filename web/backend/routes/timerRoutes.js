import express from 'express';
import { 
  getShopTimers, 
  createTimer, 
  trackImpression, 
  getActiveTimerForProduct 
} from '../controllers/timerController.js';

const router = express.Router();

/**
 * Admin Routes (Should be protected by Shopify Session Validation)
 */
router.get('/timers', getShopTimers);
router.post('/timers', createTimer);

/**
 * Public Storefront Proxy Routes
 * These are called by the Preact widget on the product page.
 */
router.get('/active-timer', getActiveTimerForProduct);
router.post('/timers/:timerId/impression', trackImpression);

export default router;
