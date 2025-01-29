export const formatDateTime = (dateString: string, timezone: string, timeOnly: boolean = false) => {
  if (timeOnly) {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      timeZone: timezone,
      hour12: true
    });
  }
  return new Date(dateString).toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
    hour12: true
  });
}; 