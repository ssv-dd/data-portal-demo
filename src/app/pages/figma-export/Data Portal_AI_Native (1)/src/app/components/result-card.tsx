import { Pin, Code, ExternalLink, Save, CheckSquare } from 'lucide-react';
import { VerifiedBadge } from './verified-badge';
import { Button } from './ui/button';
import { Artifact } from '../data/mock-data';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface ResultCardProps {
  artifact: Artifact;
  onPin?: (id: string) => void;
  onShowSQL?: (artifact: Artifact) => void;
  onOpenInStudio?: (artifact: Artifact) => void;
}

const mockChartData = [
  { name: 'A', value: 400 },
  { name: 'B', value: 300 },
  { name: 'C', value: 600 },
  { name: 'D', value: 200 },
  { name: 'E', value: 500 },
];

export function ResultCard({ artifact, onPin, onShowSQL, onOpenInStudio }: ResultCardProps) {
  const confidenceColor = {
    high: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-red-100 text-red-700',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Mini Chart Thumbnail */}
        <div className="w-24 h-20 bg-gray-50 rounded flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChartData}>
              <Bar dataKey="value" fill="#FF3A00" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="text-base text-gray-900 mb-1">{artifact.title}</h4>
              <p className="text-sm text-gray-600">{artifact.description}</p>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-3 flex-wrap mt-3">
            {artifact.source && (
              <span className="text-xs text-gray-500">
                Source: <span className="text-gray-700">{artifact.source}</span>
              </span>
            )}
            
            {artifact.confidence && (
              <span className={`text-xs px-2 py-0.5 rounded ${confidenceColor[artifact.confidence]}`}>
                {artifact.confidence} confidence
              </span>
            )}

            <VerifiedBadge
              verified={artifact.verified}
              verifiedBy={artifact.verifiedBy}
              verifiedDate={artifact.verifiedDate}
            />

            {/* Action Icons */}
            <div className="ml-auto flex items-center gap-1">
              {artifact.type === 'sql' && onShowSQL && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShowSQL(artifact)}
                  className="h-8 px-2"
                  title="Show SQL"
                >
                  <Code className="w-4 h-4" />
                </Button>
              )}
              
              {onPin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPin(artifact.id)}
                  className="h-8 px-2"
                  title="Pin to Dashboard"
                >
                  <Pin className="w-4 h-4" />
                </Button>
              )}

              {artifact.type === 'sql' && onOpenInStudio && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenInStudio(artifact)}
                  className="h-8 px-2"
                  title="Open in SQL Studio"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                title="Save to Discovery"
              >
                <Save className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                title="Verify Asset"
              >
                <CheckSquare className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
