/**
 * Formats duration in minutes to hours and minutes display
 * @param minutes - Duration in minutes
 * @returns Formatted string like "4h 50min" or "45min"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
}

/**
 * Formats duration in minutes to a more detailed format
 * @param minutes - Duration in minutes
 * @returns Formatted string like "4 hours 50 minutes" or "45 minutes"
 */
export function formatDurationLong(minutes: number): string {
  if (minutes < 60) {
    const roundedMinutes = Math.round(minutes);
    return `${roundedMinutes} ${roundedMinutes === 1 ? 'minute' : 'minutes'}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  const hoursText = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  const minutesText = `${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
  
  return `${hoursText} ${minutesText}`;
}
