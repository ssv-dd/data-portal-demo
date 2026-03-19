import { AlertTriangle } from 'lucide-react';

interface ConfidenceBannerProps {
  confidence: 'low' | 'medium';
}

export function ConfidenceBanner({ confidence }: ConfidenceBannerProps) {
  if (confidence !== 'low') return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm text-yellow-900">
          Low confidence — recommended reviewer check.
        </p>
        <p className="text-xs text-yellow-700 mt-1">
          This result may require manual verification before use in production dashboards.
        </p>
      </div>
    </div>
  );
}
