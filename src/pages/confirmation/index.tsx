import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const ConfirmationPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-400/75 via-blue-400/75 to-yellow-600/75">
      <div className="max-w-md w-full text-center space-y-6 bg-card rounded-lg p-8">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Your interviews have been successfully scheduled. You will receive a confirmation email shortly with all the details.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => router.push('/')}
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;