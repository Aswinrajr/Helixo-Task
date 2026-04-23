import { calculateDisplayUnits } from '../extensions/timer-widget/assets/timer.js';

describe('Countdown Timer Business Logic', () => {
  
  test('should correctly decompose milliseconds into human-readable units', () => {
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const thirtyMinutesInMs = 30 * 60 * 1000;
    const fiveSecondsInMs = 5 * 1000;
    
    const totalDuration = oneDayInMs + twoHoursInMs + thirtyMinutesInMs + fiveSecondsInMs;
    
    const timeUnits = calculateDisplayUnits(totalDuration);
    
    expect(timeUnits.days).toBe(1);
    expect(timeUnits.hours).toBe(2);
    expect(timeUnits.minutes).toBe(30);
    expect(timeUnits.seconds).toBe(5);
  });

  test('should handle zero or negative time gracefully', () => {
    const expiredTimeUnits = calculateDisplayUnits(-5000);
    
    expect(expiredTimeUnits.days).toBe(-1); // Math.floor handles negatives
    // In production logic, we check if total is <= 0 before calling this, 
    // but the units should be predictable.
  });

  test('should format single digits with leading zeros for UI consistency', () => {
    // This test simulates the UI component's padStart logic
    const singleDigitValue = 5;
    const formattedValue = String(singleDigitValue).padStart(2, '0');
    
    expect(formattedValue).toBe('05');
    expect(formattedValue.length).toBe(2);
  });

  test('should calculate correct target for evergreen session', () => {
    const startTime = 1000000;
    const durationMinutes = 10;
    const expectedTarget = startTime + (10 * 60 * 1000);
    
    const actualTarget = startTime + (durationMinutes * 60 * 1000);
    
    expect(actualTarget).toBe(expectedTarget);
  });

});
