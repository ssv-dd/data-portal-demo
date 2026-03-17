import { CheckCircle, Circle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface VerifiedBadgeProps {
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
}

export function VerifiedBadge({ verified, verifiedBy, verifiedDate }: VerifiedBadgeProps) {
  const tooltipContent = verified
    ? `Verified: Approved for organizational AI insights by ${verifiedBy || 'Unknown'} on ${verifiedDate || 'Unknown date'}`
    : 'Unverified: Not eligible for org AI summaries';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${
              verified
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-gray-50 text-gray-600 border border-gray-300'
            }`}
          >
            {verified ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <Circle className="w-3 h-3" />
            )}
            <span>{verified ? 'Verified' : 'Unverified'}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
