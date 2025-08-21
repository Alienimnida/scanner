import { AlertOctagon } from 'lucide-react';

interface ErrorAlertProps {
  error: string;
}

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  return (
    <div className="mb-6 p-4 bg-red-950/50 border border-red-500 text-red-200 rounded-lg flex items-center gap-3">
      <AlertOctagon className="w-5 h-5 text-red-400" />
      <div>
        <strong>Error:</strong> {error}
      </div>
    </div>
  );
};