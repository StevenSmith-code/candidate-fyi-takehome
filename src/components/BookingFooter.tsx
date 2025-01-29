import { Button } from "@/components/ui/button";

interface BookingFooterProps {
  selectedCount: number;
  onProceed: () => void;
}

export function BookingFooter({ selectedCount, onProceed }: BookingFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-card z-10 border-t">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div>
          <p>{selectedCount} interviews selected</p>
        </div>
        <Button 
          onClick={onProceed}
          disabled={selectedCount === 0}
        >
          Proceed to Booking
        </Button>
      </div>
    </div>
  );
} 