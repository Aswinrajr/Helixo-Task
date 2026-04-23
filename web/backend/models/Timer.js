import mongoose from 'mongoose';

/**
 * @typedef {Object} TimerConfiguration
 * @property {Date} [startTime] - Required for fixed timers
 * @property {Date} [endTime] - Required for fixed timers
 * @property {number} [durationMinutes] - Required for evergreen timers
 * @property {number} [resetAfterDays] - How long to wait before resetting evergreen timer
 */

/**
 * @typedef {Object} TimerTargeting
 * @property {'all' | 'specific_products' | 'specific_collections'} applyTo
 * @property {string[]} productIds - Shopify GIDs
 * @property {string[]} collectionIds - Shopify GIDs
 */

const timerSchema = new mongoose.Schema({
  shopDomain: { 
    type: String, 
    required: true, 
    index: true,
    description: 'The unique shopify store domain for multi-tenant isolation'
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'scheduled', 'expired', 'disabled'], 
    default: 'active' 
  },
  
  // Timer Strategy
  type: { 
    type: String, 
    enum: ['fixed', 'evergreen'], 
    required: true 
  },
  configuration: {
    startTime: Date,
    endTime: Date,
    durationMinutes: Number,
    resetAfterDays: { type: Number, default: 1 },
  },

  // Targeting Logic
  targeting: {
    applyTo: { 
      type: String, 
      enum: ['all', 'specific_products', 'specific_collections'], 
      required: true 
    },
    productIds: [String],
    collectionIds: [String],
  },

  // Visual Design System
  appearance: {
    backgroundColor: { type: String, default: '#000000' },
    textColor: { type: String, default: '#FFFFFF' },
    fontSize: { type: String, default: '16px' },
    position: { 
      type: String, 
      enum: ['top', 'bottom', 'inline'], 
      default: 'inline' 
    },
    customCss: String,
    expiredMessage: { type: String, default: 'Promotion has ended' }
  },

  // Performance & Analytics
  analytics: {
    impressionCount: { type: Number, default: 0 },
    lastCalculatedAt: Date
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if currently active
timerSchema.virtual('isCurrentlyRunning').get(function() {
  if (this.status !== 'active') return false;
  
  if (this.type === 'fixed') {
    const now = new Date();
    return now >= this.configuration.startTime && now <= this.configuration.endTime;
  }
  
  return true; // Evergreen is always running for the store, session handled on client
});

const Timer = mongoose.model('Timer', timerSchema);

export default Timer;
