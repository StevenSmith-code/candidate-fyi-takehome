import { useState, useEffect } from 'react';
import { Schedule, ScheduleResponse } from '../../types';

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/schedules");
      const data: ScheduleResponse = await response.json();
      setSchedules(data.results);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return { schedules, loading };
} 