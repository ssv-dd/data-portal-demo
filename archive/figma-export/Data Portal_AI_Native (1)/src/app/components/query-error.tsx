import { XCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface QueryErrorProps {
  error: string;
  onRetry?: () => void;
  onOpenInStudio?: () => void;
}

export function QueryError({ error, onRetry, onOpenInStudio }: QueryErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-base text-red-900 mb-1">SQL run failed</h3>
          <div className="bg-red-100 p-3 rounded text-xs text-red-800 font-mono mt-2">
            {error.substring(0, 200)}
            {error.length > 200 && '...'}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        )}
        {onOpenInStudio && (
          <Button
            size="sm"
            onClick={onOpenInStudio}
            style={{ backgroundColor: '#FF3A00' }}
            className="text-white"
          >
            Open in SQL Studio
          </Button>
        )}
      </div>
    </div>
  );
}
