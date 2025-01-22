import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/router';
import { Schedule, ScheduleResponse, SelectedInterview } from "../../../types";
import { Spinner } from "@/lib/spinner";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import Autoplay from "embla-carousel-autoplay"
  


export function InterviewScheduler() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Get selected interviews from URL params
  const getSelectedFromUrl = (): SelectedInterview[] => {
    const { selected } = router.query;
    if (!selected) return [];
    try {
      return JSON.parse(decodeURIComponent(selected as string));
    } catch {
      return [];
    }
  };

  // Update URL when selections change
  const updateUrlWithSelections = (selections: SelectedInterview[]) => {
    const queryParams = selections.length > 0
      ? { selected: encodeURIComponent(JSON.stringify(selections)) }
      : {};
    
    router.replace(
      {
        pathname: router.pathname,
        query: queryParams,
      },
      undefined,
      { shallow: true }
    );
  };

  // Modified toggle function to update URL
  const toggleInterviewSelection = (scheduleId: number, interviewId: string) => {
    const currentSelections = getSelectedFromUrl();
    const isSelected = currentSelections.some(
      (selectedInterview) => 
        selectedInterview.scheduleId === scheduleId && 
        selectedInterview.interviewId === interviewId
    );
    
    let newSelections;
    if (isSelected) {
      newSelections = currentSelections.filter(
        (selectedInterview) => 
          !(selectedInterview.scheduleId === scheduleId && 
            selectedInterview.interviewId === interviewId)
      );
    } else {
      newSelections = [...currentSelections, { scheduleId, interviewId }];
    }
    
    updateUrlWithSelections(newSelections);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    const savedTimezone = localStorage.getItem('preferredTimezone');
    if (savedTimezone) {
      setTimezone(savedTimezone);
    }
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

  if (loading) return <div className="h-full w-full flex items-center justify-center"><Spinner/></div>

  return (
    <div className="flex justify-between items-center w-3/4 mx-auto p-8 bg-card rounded-lg">
      <div className="flex flex-col justify-center items-center w-2/5 h-[620px] bg-green-500/50 rounded-lg">
        <h1 className="text-2xl mb-4 text-primary font-bold">Interview Schedules</h1>
        <p className="text-primary mb-8">Select the interviews you would like to schedule</p>
        <div className="flex items-center justify-center gap-4">
            <p className="text-primary">Select Preferred Timezone</p>
        <select 
          className="p-2 border rounded-md"
          value={timezone}
          onChange={(e) => {
            const newTimezone = e.target.value;
            setTimezone(newTimezone);
            localStorage.setItem('preferredTimezone', newTimezone);
          }}
        >
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="UTC">UTC</option>
        </select>
        </div>
      </div>

      <Carousel  plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]} className="w-2/4 mr-10" opts={{
        align: "start",
        loop: true,
      }}>
        <CarouselContent>
          {schedules.map((schedule, scheduleIndex) => (
            <CarouselItem key={scheduleIndex}>
              <div className="mb-8 p-8 rounded-lg h-full">
                <h2 className="text-xl font-semibold mb-4">
                  {schedule.scheduleName}
                </h2>
                <div className="grid gap-4">
                  {schedule.interviews.map((interview) => {
                    const selectedInterviews = getSelectedFromUrl();
                    const isSelected = selectedInterviews.some(
                      (selectedInterview) => selectedInterview.scheduleId === scheduleIndex && selectedInterview.interviewId === interview.id
                    );

                    return (
                      <div
                        key={interview.id}
                        className={`p-4 border rounded-lg ${
                          isSelected
                            ? "border-primary bg-secondary/75"
                            : "border-border bg-secondary"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{interview.interviewName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(interview.startTime)} -{" "}
                              {formatDateTime(interview.endTime, true)}
                            </p>
                            <p className="text-sm mt-1">
                              Interviewers:{" "}
                              {interview.interviewers.map((i) => i.name).join(", ")}
                            </p>
                          </div>
                          <Button
                            variant="default"
                            onClick={() => toggleInterviewSelection(scheduleIndex, interview.id)}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {getSelectedFromUrl().length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-blue-400/50 z-10 border-t">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <p>{getSelectedFromUrl().length} interviews selected</p>
            <Button onClick={() => router.push({
                pathname: "/review",
                query: {
                    selected: encodeURIComponent(JSON.stringify(getSelectedFromUrl())),
                    timezone: timezone
                }
            })}>Proceed to Booking</Button>
          </div>
        </div>
      )}
    </div>
  );
}