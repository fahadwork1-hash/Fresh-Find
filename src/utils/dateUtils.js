// Date and Time calculation utilities for FreshFind

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

/**
 * Converts "14:30" (24h) to "2:30 PM"
 */
export function formatTime12h(timeStr) {
  if (!timeStr || timeStr === '00:00') return '';
  const [hStr, mStr] = timeStr.split(':');
  let hour = parseInt(hStr, 10);
  const minutes = mStr || '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${hour}:${minutes} ${ampm}`;
}

/**
 * Get current time string in "HH:MM:SS AM/PM" format
 */
export function formatCurrentTimeString(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

/**
 * Get full formatted date string (e.g., "Thursday, Sep 24, 2026")
 */
export function formatCurrentDateString(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Calculates real-time open status of a market based on current day and time
 * @param {Object} schedule - Market schedule object with keys Monday..Sunday
 * @param {Date} [currentTime=new Date()] - Optional date object for testing/simulation
 * @returns {Object} { isOpenNow, statusText, subText, badgeClass, isTodayOperating }
 */
export function getMarketOpenStatus(schedule, currentTime = new Date()) {
  if (!schedule) {
    return {
      isOpenNow: false,
      statusText: 'Closed',
      subText: 'Schedule unavailable',
      badgeClass: 'bg-stone-100 text-stone-700 border-stone-200'
    };
  }

  const currentDayIndex = currentTime.getDay();
  const currentDayName = DAYS_OF_WEEK[currentDayIndex];
  
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentMinutesFromMidnight = currentHours * 60 + currentMinutes;

  const todaySchedule = schedule[currentDayName];

  // Helper to parse "HH:mm" to minutes from midnight
  const parseToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + (m || 0);
  };

  // Check if market is open today and within hours
  if (todaySchedule && todaySchedule.isOpen) {
    const openMinutes = parseToMinutes(todaySchedule.openTime);
    const closeMinutes = parseToMinutes(todaySchedule.closeTime);

    if (currentMinutesFromMidnight >= openMinutes && currentMinutesFromMidnight < closeMinutes) {
      return {
        isOpenNow: true,
        statusText: 'Open Now',
        subText: `Closes at ${formatTime12h(todaySchedule.closeTime)}`,
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
        dotClass: 'bg-emerald-500 animate-pulse',
        isTodayOperating: true,
        minutesUntilClose: closeMinutes - currentMinutesFromMidnight
      };
    } else if (currentMinutesFromMidnight < openMinutes) {
      return {
        isOpenNow: false,
        statusText: 'Opens Today',
        subText: `Opens at ${formatTime12h(todaySchedule.openTime)}`,
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        dotClass: 'bg-amber-500',
        isTodayOperating: true,
        nextOpen: `Today at ${formatTime12h(todaySchedule.openTime)}`
      };
    }
  }

  // Not open today or closed for the day -> find next open day
  for (let offset = 1; offset <= 7; offset++) {
    const nextDayIndex = (currentDayIndex + offset) % 7;
    const nextDayName = DAYS_OF_WEEK[nextDayIndex];
    const nextSchedule = schedule[nextDayName];

    if (nextSchedule && nextSchedule.isOpen) {
      const dayLabel = offset === 1 ? 'Tomorrow' : nextDayName;
      return {
        isOpenNow: false,
        statusText: 'Closed',
        subText: `Opens ${dayLabel} at ${formatTime12h(nextSchedule.openTime)}`,
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        dotClass: 'bg-rose-400',
        isTodayOperating: false,
        nextOpenDayName: nextDayName,
        nextOpenDayOffset: offset,
        nextOpen: `${dayLabel} at ${formatTime12h(nextSchedule.openTime)}`
      };
    }
  }

  return {
    isOpenNow: false,
    statusText: 'Closed',
    subText: 'Seasonal or closed for renovation',
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
    dotClass: 'bg-stone-400',
    isTodayOperating: false
  };
}

/**
 * Returns current season ID based on month ('spring', 'summer', 'autumn', 'winter')
 */
export function getCurrentSeasonId(date = new Date()) {
  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  if (month >= 2 && month <= 4) return 'spring'; // Mar, Apr, May
  if (month >= 5 && month <= 7) return 'summer'; // Jun, Jul, Aug
  if (month >= 8 && month <= 10) return 'autumn'; // Sep, Oct, Nov
  return 'winter'; // Dec, Jan, Feb
}
