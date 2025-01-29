import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/utils/dateFormat";
import { Interview } from "../../types";

interface InterviewCardProps {
  interview: Interview;
  isSelected: boolean;
  timezone: string;
  onSelect: () => void;
}

export function InterviewCard({ interview, isSelected, timezone, onSelect }: InterviewCardProps) {
  return (
    <div
      className={`p-4 border rounded-lg ${
        isSelected ? "border-primary bg-secondary/75" : "border-border bg-secondary"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{interview.interviewName}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(interview.startTime, timezone)} -{" "}
            {formatDateTime(interview.endTime, timezone, true)}
          </p>
          <p className="text-sm mt-1">
            Interviewers: {interview.interviewers.map((i: { name: string }) => i.name).join(", ")}
          </p>
        </div>
        <Button variant="default" onClick={onSelect}>
          {isSelected ? "Selected" : "Select"}
        </Button>
      </div>
    </div>
  );
} 