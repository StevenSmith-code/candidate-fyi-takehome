export interface Interviewer {
    name: string;
    id: string;
  }
  
export interface Interview {
    id: string;
    interviewName: string;
    interviewers: Interviewer[];
    startTime: string;
    endTime: string;
  }
  
export interface Schedule {
    interviewCount: number;
    scheduleName: string;
    interviews: Interview[];
  }
  
 export interface ScheduleResponse {
    count: number;
    results: Schedule[];
  }
  
 export interface SelectedInterview {
    scheduleId: number;
    interviewId: string;
  }