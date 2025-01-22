import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Schedule, SelectedInterview } from '../../../types';

const ConfirmationPage = () => {

  interface Error {
    message: string;
  }

  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const timezone = router.query.timezone as string;

  // Get selected interviews from URL with proper decoding
  const selectedInterviews: SelectedInterview[] = router.query.selected 
    ? JSON.parse(decodeURIComponent(router.query.selected as string))
    : [];

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/schedules");
        const data = await response.json();
        setSchedules(data.results);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/book", {
        method: "POST",
        body: JSON.stringify(selectedInterviews),
      });
      const data = await response.json();
      router.push("/confirmation");
      
      if (!response.ok) {
        throw new Error(data.message || "Error confirming booking");
      }
      
      console.log(data);
      // router.push("/");
    } catch (error) {
      setError({ message: error instanceof Error ? error.message : "Error confirming booking" });
    } finally {
      setLoading(false);
    } 
  };

  const formatDateTime = (dateString: string, timeOnly: boolean = false) => {
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

  if (!selectedInterviews.length) return <div>No interviews selected</div>;

  return (
    <div className="h-screen flex flex-col justify-center bg-gradient-to-br from-purple-400/75 via-blue-400/75 to-yellow-600/75">
      <div className='max-w-4xl mx-auto'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Review Your Interviews</h1>
        <Button 
          className='bg-card'
          variant="outline" 
          onClick={() => router.back()}
        >
          Back to Selection
        </Button>
      </div>

      <div className="space-y-6">
        {selectedInterviews.map((selected) => {
          const schedule = schedules[selected.scheduleId];
          const interview = schedule?.interviews.find(i => i.id === selected.interviewId);
          
          if (!schedule || !interview) return null;

          return (
            <div 
              key={`${selected.scheduleId}-${selected.interviewId}`}
              className="border rounded-lg p-4 shadow-sm bg-white/90"
            >
              <div className="mb-2">
                <h2 className="text-xl font-semibold">{schedule.scheduleName}</h2>
                <h3 className="text-lg text-primary">{interview.interviewName}</h3>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Time: </span>
                  {formatDateTime(interview.startTime)} - {formatDateTime(interview.endTime, true)}
                </p>
                <p>
                  <span className="font-medium">Interviewers: </span>
                  {interview.interviewers.map(i => i.name).join(', ')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
        {error && <p className="text-red-500">{error.message}</p>}
      <div className="mt-8 flex justify-between items-center">
        <p className="text-lg">
          Total Interviews: <span className="font-bold">{selectedInterviews.length}</span>
        </p>
        <Button 
          onClick={(e) => {
            e.preventDefault();
            handleConfirmBooking();
          }}
          disabled={loading}
        >
          Confirm Booking
        </Button>
      </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;