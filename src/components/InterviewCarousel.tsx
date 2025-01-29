import { Schedule } from "../../types";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

interface InterviewCarouselProps {
  schedules: Schedule[];
  timezone: string;
  selectionError: string | null;
  onInterviewSelect: (scheduleId: number, interviewId: string) => void;
  getSelectedFromUrl: () => { scheduleId: number; interviewId: string; }[];
}

export function InterviewCarousel({ 
  schedules, 
  timezone, 
  selectionError, 
  onInterviewSelect,
  getSelectedFromUrl 
}: InterviewCarouselProps) {



  // const sortTimeslotsByRibbon = (selectedDate) =>{ 
  //   schedules.filter()
  // }

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

  return (
    <Carousel plugins={[Autoplay({ delay: 2000 })]} 
      className="w-2/4 mr-10" 
      opts={{ align: "start", loop: true }}>
      <CarouselContent>
        {schedules.map((schedule, scheduleIndex) => (
          <CarouselItem key={scheduleIndex}>
            <div className="mb-8 p-8 rounded-lg h-full">
              {selectionError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {selectionError}
                </div>
              )}
              <h2 className="text-xl font-semibold mb-4">{schedule.scheduleName}</h2>
              <div className="grid gap-4">
                {schedule.interviews.map((interview) => {
                  const isSelected = getSelectedFromUrl().some(
                    (selectedInterview) => 
                      selectedInterview.scheduleId === scheduleIndex && 
                      selectedInterview.interviewId === interview.id
                  );

                  return (
                    <div key={interview.id}
                      className={`p-4 border rounded-lg ${
                        isSelected ? "border-primary bg-secondary/75" : "border-border bg-secondary"
                      }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{interview.interviewName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(interview.startTime)} - {formatDateTime(interview.endTime, true)}
                          </p>
                          <p className="text-sm mt-1">
                            Interviewers: {interview.interviewers.map((i) => i.name).join(", ")}
                          </p>
                        </div>
                        <Button
                          variant="default"
                          onClick={() => onInterviewSelect(scheduleIndex, interview.id)}
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
  );
} 