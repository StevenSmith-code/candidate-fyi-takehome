import { useState, useEffect } from 'react';

export function useTimezone() {
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  useEffect(() => {
    const savedTimezone = localStorage.getItem('preferredTimezone');
    if (savedTimezone) {
      setTimezone(savedTimezone);
    }
  }, []);

  const updateTimezone = (newTimezone: string) => {
    setTimezone(newTimezone);
    localStorage.setItem('preferredTimezone', newTimezone);
  };

  return { timezone, updateTimezone };
} 