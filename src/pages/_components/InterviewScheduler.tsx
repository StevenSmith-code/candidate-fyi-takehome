import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Interviewer {
  name: string;
  id: string;
}

interface Interview {
  id: string;
  interviewName: string;
  interviewers: Interviewer[];
  startTime: string;
  endTime: string;
}

interface Schedule {
  interviewCount: number;
  scheduleName: string;
  interviews: Interview[];
}

interface ScheduleResponse {
  count: number;
  results: Schedule[];
}

export function InterviewScheduler() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedInterviews, setSelectedInterviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

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

  const toggleInterviewSelection = (interviewId: string) => {
    setSelectedInterviews((prev) =>
      prev.includes(interviewId)
        ? prev.filter((id) => id !== interviewId)
        : [...prev, interviewId]
    );
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div>Loading schedules...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Interview Schedules</h1>

      {schedules.map((schedule, index) => (
        <div key={index} className="mb-8 border-2 border-black  p-4">
          <h2 className="text-xl font-semibold mb-4">
            {schedule.scheduleName}
          </h2>
          <div className="grid gap-4">
            {schedule.interviews.map((interview) => (
              <div
                key={interview.id}
                className={`p-4 border rounded-lg ${
                  selectedInterviews.includes(interview.id)
                    ? "border-primary bg-secondary"
                    : "border-border"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{interview.interviewName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(interview.startTime)} -{" "}
                      {formatDateTime(interview.endTime)}
                    </p>
                    <p className="text-sm mt-1">
                      Interviewers:{" "}
                      {interview.interviewers.map((i) => i.name).join(", ")}
                    </p>
                  </div>
                  <Button
                    variant={
                      selectedInterviews.includes(interview.id)
                        ? "secondary"
                        : "outline"
                    }
                    onClick={() => toggleInterviewSelection(interview.id)}
                  >
                    {selectedInterviews.includes(interview.id)
                      ? "Selected"
                      : "Selectawfawff"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedInterviews.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <p>{selectedInterviews.length} interviews selected</p>
            <Button>Proceed to Booking</Button>
          </div>
        </div>
      )}
    </div>
  );
}