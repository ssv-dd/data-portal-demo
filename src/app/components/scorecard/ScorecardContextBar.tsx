import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import type { ProductArea } from '@/types';

interface ScorecardContextBarProps {
  areas: ProductArea[];
  selectedAreas: string[];
  onToggleArea: (areaId: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export function ScorecardContextBar({
  areas,
  selectedAreas,
  onToggleArea,
  timeRange,
  onTimeRangeChange,
}: ScorecardContextBarProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-16">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Product Areas:</span>
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto max-w-[750px] pb-1 scrollbar-thin">
                {areas.map(area => (
                  <Button
                    key={area.id}
                    variant={selectedAreas.includes(area.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onToggleArea(area.id)}
                    className="text-xs whitespace-nowrap shrink-0"
                  >
                    {area.name}
                  </Button>
                ))}
              </div>
              {/* Gradient fade indicator */}
              <div className="absolute right-0 top-0 bottom-1 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Comparison:</span>
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
              className="text-sm px-2 py-1 rounded border bg-background"
            >
              <option value="dod">DoD</option>
              <option value="wow">WoW</option>
              <option value="mom">MoM</option>
              <option value="yoy">YoY</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            Updated 5 mins ago
          </div>
        </div>
      </div>

      {/* Subsidiary Callout */}
      <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
        <span className="font-medium">Scope:</span> DoorDash US, DoorDash Canada, SevenRooms
        <span className="mx-2">|</span>
        <span className="text-yellow-700">⚠️ Excludes: Wolt, Deliveroo (pending integration)</span>
      </div>
    </Card>
  );
}
