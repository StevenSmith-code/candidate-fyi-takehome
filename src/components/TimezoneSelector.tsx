interface TimezoneSelectorProps {
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export function TimezoneSelector({ timezone, onTimezoneChange }: TimezoneSelectorProps) {
  return (
    <div className="flex flex-col justify-center items-center w-2/5 h-[620px] bg-green-500/50 rounded-lg">
      <h1 className="text-2xl mb-4 text-primary font-bold">Interview Schedules</h1>
      <p className="text-primary mb-8">Select the interviews you would like to schedule</p>
      <div className="flex items-center justify-center gap-4">
        <p className="text-primary">Select Preferred Timezone</p>
        <select 
          className="p-2 border rounded-md"
          value={timezone}
          onChange={(e) => onTimezoneChange(e.target.value)}
        >
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="UTC">UTC</option>
        </select>
      </div>
    </div>
  );
} 