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
import { useSchedules } from "@/hooks/useSchedules";
import { useTimezone } from "@/hooks/useTimezone";
import { TimezoneSelector } from "@/components/TimezoneSelector";
import { InterviewCarousel } from "@/components/InterviewCarousel";
import { BookingFooter } from "@/components/BookingFooter";


export function InterviewScheduler() {
  const router = useRouter();
  const { schedules, loading } = useSchedules();
  const { timezone, updateTimezone } = useTimezone();
  const [selectionError, setSelectionError] = useState<string | null>(null);

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
    setSelectionError(null); // Reset error on new selection
    const currentSelections = getSelectedFromUrl();
    const isSelected = currentSelections.some(
      (selectedInterview) => 
        selectedInterview.scheduleId === scheduleId && 
        selectedInterview.interviewId === interviewId
    );
    
    if (!isSelected) {
      // Check for time conflicts
      const newInterview = schedules[scheduleId].interviews.find(interview => interview.id === interviewId);
      const hasTimeConflict = currentSelections.some(selection => {
        const existingInterview = schedules[selection.scheduleId].interviews.find(
          interview => interview.id === selection.interviewId
        );
        if (!newInterview || !existingInterview) return false;
        
        const newStart = new Date(newInterview.startTime);
        const newEnd = new Date(newInterview.endTime);
        const existingStart = new Date(existingInterview.startTime);
        const existingEnd = new Date(existingInterview.endTime);
        
        return (newStart < existingEnd && newEnd > existingStart);
      });

      if (hasTimeConflict) {
        setSelectionError("This interview time conflicts with another selected interview");
        return;
      }
    }
    
    let newSelections = isSelected
      ? currentSelections.filter(
          (selectedInterview) => 
            !(selectedInterview.scheduleId === scheduleId && 
              selectedInterview.interviewId === interviewId)
        )
      : [...currentSelections, { scheduleId, interviewId }];
    
    updateUrlWithSelections(newSelections);
  };

  if (loading) return <div className="h-full w-full flex items-center justify-center"><Spinner/></div>;

  return (
    <div className="flex justify-between items-center w-3/4 mx-auto p-8 bg-card rounded-lg">
      <TimezoneSelector 
        timezone={timezone} 
        onTimezoneChange={updateTimezone} 
      />

      <InterviewCarousel 
        schedules={schedules}
        timezone={timezone}
        selectionError={selectionError}
        onInterviewSelect={toggleInterviewSelection}
        getSelectedFromUrl={getSelectedFromUrl}
      />

      <BookingFooter 
        selectedCount={getSelectedFromUrl().length}
        onProceed={() => router.push({
          pathname: "/review",
          query: {
            selected: encodeURIComponent(JSON.stringify(getSelectedFromUrl())),
            timezone: timezone
          }
        })}
      />
    </div>
  );
}