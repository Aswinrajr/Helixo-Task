import { h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

/**
 * The core Timer component designed for maximum performance and zero layout shift.
 */
const CountdownWidget = ({ timerConfiguration }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false); // New: State for urgency cues

  useEffect(() => {
    let countdownInterval;
    
    const initializeTimer = () => {
      let targetTime;

      if (timerConfiguration.type === 'fixed') {
        targetTime = new Date(timerConfiguration.configuration.endTime).getTime();
      } else if (timerConfiguration.type === 'evergreen') {
        const storageKey = `helixo_timer_${timerConfiguration._id}`;
        let startTime = localStorage.getItem(storageKey);

        if (!startTime) {
          startTime = Date.now();
          localStorage.setItem(storageKey, startTime);
        }

        const durationInMs = timerConfiguration.configuration.durationMinutes * 60 * 1000;
        targetTime = parseInt(startTime) + durationInMs;
      }

      const updateCountdown = () => {
        const currentTime = Date.now();
        const difference = targetTime - currentTime;

        if (difference <= 0) {
          setIsExpired(true);
          clearInterval(countdownInterval);
          return;
        }

        if (difference <= 3600000) { // Less than 1 hour remaining
          setIsUrgent(true);
        }

        setTimeRemaining(calculateDisplayUnits(difference));
      };

      updateCountdown();
      countdownInterval = setInterval(updateCountdown, 1000);
    };

    initializeTimer();
    trackImpression(timerConfiguration._id);

    return () => clearInterval(countdownInterval);
  }, [timerConfiguration]);

  if (isExpired) {
    return (
      <div className="helixo-expired-message" style={getBannerStyles(timerConfiguration)}>
        {timerConfiguration.appearance.expiredMessage}
      </div>
    );
  }

  if (!timeRemaining) return null; // Prevent flash of unstyled content

  return (
    <div 
      className={`helixo-timer-wrapper ${isUrgent ? 'helixo-urgent' : ''}`} 
      style={getBannerStyles(timerConfiguration, isUrgent)}
    >
      <div className="helixo-timer-title">
        {isUrgent ? '🔥 HURRY! OFFER ENDING SOON' : timerConfiguration.title}
      </div>
      <div className="helixo-timer-clock">
        <TimeUnit value={timeRemaining.days} label="Days" />
        <TimeUnit value={timeRemaining.hours} label="Hrs" />
        <TimeUnit value={timeRemaining.minutes} label="Min" />
        <TimeUnit value={timeRemaining.seconds} label="Sec" />
      </div>
    </div>
  );
};

const TimeUnit = ({ value, label }) => (
  <div className="helixo-unit-container">
    <span className="helixo-unit-value">{String(value).padStart(2, '0')}</span>
    <span className="helixo-unit-label">{label}</span>
  </div>
);

// --- Helper Functions (Pro Readability) ---

function calculateDisplayUnits(milliseconds) {
  return {
    days: Math.floor(milliseconds / (1000 * 60 * 60 * 24)),
    hours: Math.floor((milliseconds / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((milliseconds / 1000 / 60) % 60),
    seconds: Math.floor((milliseconds / 1000) % 60),
  };
}

function getBannerStyles(config, isUrgent) {
  return {
    backgroundColor: isUrgent ? '#FF4136' : config.appearance.backgroundColor,
    color: config.appearance.textColor,
    fontSize: config.appearance.fontSize,
    padding: '15px',
    textAlign: 'center',
    borderRadius: '4px',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    animation: isUrgent ? 'helixo-pulse 1.5s infinite' : 'none'
  };
}

async function trackImpression(timerId) {
  try {
    await fetch(`/apps/helixo/api/timers/${timerId}/impression`, { method: 'POST' });
  } catch (error) {
    console.warn('Analytics tracking failed silently to prevent storefront disruption');
  }
}

// Initializing the widget safely
const mountPoint = document.getElementById('helixo-countdown-anchor');
if (mountPoint) {
  const config = JSON.parse(mountPoint.dataset.config);
  render(<CountdownWidget timerConfiguration={config} />, mountPoint);
}
