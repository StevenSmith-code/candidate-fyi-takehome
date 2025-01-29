import { useRouter } from 'next/router';
import { SelectedInterview } from "../../../types";
import { Spinner } from "@/lib/spinner";

import { useSchedules } from "@/hooks/useSchedules";
import { useTimezone } from "@/hooks/useTimezone";
import { TimezoneSelector } from "@/components/TimezoneSelector";
import { InterviewCarousel } from "@/components/InterviewCarousel";
import { BookingFooter } from "@/components/BookingFooter";
import { useEffect, useState } from 'react';


export function InterviewScheduler() {
  const router = useRouter();
  const { schedules, loading } = useSchedules();
  const { timezone, updateTimezone } = useTimezone();
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [dateForRibbon, setDateForRibbon] = useState([])

  const getDatesFromSchedules = () => {
    return schedules.map((schedule, index) => (
     <div key={index}>{schedule.interviews[0].startTime}</div>
    ))
  }

  useEffect(() => {
    console.log(dateForRibbon)
  }, [])

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
    setSelectionError(null);
    const currentSelections = getSelectedFromUrl();

    // Check if this specific interview is already selected
    const isSelected = currentSelections.some(
      (selectedInterview) => 
        selectedInterview.scheduleId === scheduleId && 
        selectedInterview.interviewId === interviewId
    );
    
    // Time conflict checking (only when adding a new interview)
    if (!isSelected) {
      // Find the interview we're trying to add
      const newInterview = schedules[scheduleId].interviews.find(
        interview => interview.id === interviewId
      );

      // Check against each currently selected interview for conflicts
      const hasTimeConflict = currentSelections.some(selection => {
        // Find the existing interview we're comparing against
        const existingInterview = schedules[selection.scheduleId].interviews.find(
          interview => interview.id === selection.interviewId
        );
        
        // Safety check - if either interview isn't found, no conflict
        if (!newInterview || !existingInterview) return false;
        
        // Convert time strings to Date objects for comparison
        const newStart = new Date(newInterview.startTime);
        const newEnd = new Date(newInterview.endTime);
        const existingStart = new Date(existingInterview.startTime);
        const existingEnd = new Date(existingInterview.endTime);
        
        // Check for overlap: new interview starts before existing ends
        // AND new interview ends after existing starts
        return (newStart < existingEnd && newEnd > existingStart);
      });

      // If there's a conflict, set error and stop
      if (hasTimeConflict) {
        setSelectionError("This interview time conflicts with another selected interview");
        return;
      }
    }
    
    // Update selections
    let newSelections = isSelected
      ? currentSelections.filter(
          (selectedInterview) => 
            !(selectedInterview.scheduleId === scheduleId && 
              selectedInterview.interviewId === interviewId)
        )
      : [...currentSelections, { scheduleId, interviewId }];
    
    // Update URL with new selections
    updateUrlWithSelections(newSelections);
  };

  if (loading) return <div className="h-full w-full flex items-center justify-center"><Spinner/></div>;

  return (
    <div className="flex justify-between items-center w-3/4 mx-auto p-8 bg-card rounded-lg">
      <TimezoneSelector 
        timezone={timezone} 
        onTimezoneChange={updateTimezone} 
      />

      {(getDatesFromSchedules())}

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