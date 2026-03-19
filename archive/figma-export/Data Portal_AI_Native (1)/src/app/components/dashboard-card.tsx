import { Share2, MoreVertical } from 'lucide-react';
import { VerifiedBadge } from './verified-badge';
import { Button } from './ui/button';
import { Artifact } from '../data/mock-data';

interface DashboardCardProps {
  artifact: Artifact;
}

export function DashboardCard({ artifact }: DashboardCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow overflow-hidden">
      {/* Thumbnail */}
      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-4xl opacity-20">{artifact.type === 'sql' ? '📊' : artifact.type === 'notebook' ? '📓' : '📈'}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-base text-gray-900">{artifact.title}</h4>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{artifact.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <div>{artifact.owner}</div>
            <div>Updated {artifact.created}</div>
          </div>

          <div className="flex items-center gap-2">
            <VerifiedBadge
              verified={artifact.verified}
              verifiedBy={artifact.verifiedBy}
              verifiedDate={artifact.verifiedDate}
            />
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
