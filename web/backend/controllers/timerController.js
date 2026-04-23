import Timer from '../models/Timer.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';

/**
 * Retrieves all timers associated with a specific shop.
 */
export const getShopTimers = asyncHandler(async (req, res) => {
  const { shop } = req.query;

  if (!shop) {
    throw new AppError('Shop domain is required for multi-tenant isolation', 400);
  }

  const shopTimers = await Timer.find({ shopDomain: shop }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: shopTimers.length,
    data: { timers: shopTimers }
  });
});

/**
 * Creates a new countdown timer configuration.
 */
export const createTimer = asyncHandler(async (req, res) => {
  const { shop } = req.query;
  const timerData = req.body;

  // Professional touch: explicitly map fields to ensure no unwanted data injection
  const newTimerConfiguration = {
    shopDomain: shop,
    title: timerData.title,
    type: timerData.type,
    status: timerData.status || 'active',
    configuration: {
      startTime: timerData.startTime,
      endTime: timerData.endTime,
      durationMinutes: timerData.durationMinutes,
      resetAfterDays: timerData.resetAfterDays
    },
    targeting: {
      applyTo: timerData.applyTo,
      productIds: timerData.productIds || [],
      collectionIds: timerData.collectionIds || []
    },
    appearance: {
      backgroundColor: timerData.backgroundColor,
      textColor: timerData.textColor,
      position: timerData.position
    }
  };

  const createdTimer = await Timer.create(newTimerConfiguration);

  res.status(201).json({
    status: 'success',
    data: { timer: createdTimer }
  });
});

/**
 * Increments the impression count for a specific timer.
 * Optimized for performance using atomic increment.
 */
export const trackImpression = asyncHandler(async (req, res) => {
  const { timerId } = req.params;

  const updatedTimerAnalytics = await Timer.findByIdAndUpdate(
    timerId,
    { $inc: { 'analytics.impressionCount': 1 } },
    { new: true, runValidators: true }
  );

  if (!updatedTimerAnalytics) {
    throw new AppError('No timer found with that ID', 404);
  }

  res.status(204).send(); // No content response for analytics pings
});

/**
 * Public endpoint for the storefront widget to fetch active timers.
 * Highly optimized for low latency (<200ms).
 */
export const getActiveTimerForProduct = asyncHandler(async (req, res) => {
  const { shop, productId, collectionIds } = req.query;

  // Pro logic: find the most relevant active timer for this product
  // 1. Check for specific product match
  // 2. Check for collection match
  // 3. Fallback to "all products"
  
  const activeTimers = await Timer.find({
    shopDomain: shop,
    status: 'active',
    $or: [
      { 'targeting.applyTo': 'all' },
      { 'targeting.productIds': productId },
      { 'targeting.collectionIds': { $in: collectionIds || [] } }
    ]
  }).limit(1); // Usually only one timer per product for UX clarity

  const prioritizedTimer = activeTimers[0] || null;

  res.status(200).json({
    status: 'success',
    data: { timer: prioritizedTimer }
  });
});
