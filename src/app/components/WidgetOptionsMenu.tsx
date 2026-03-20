import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BarChart3, LineChart as LineChartIcon, Gauge, Check, Database, TrendingUp } from 'lucide-react';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface WidgetOptionsMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentChartType: 'line' | 'area' | 'bar';
  onChartTypeChange: (type: 'line' | 'area' | 'bar') => void;
  currentTimePeriod: number;
  onTimePeriodChange: (value: number) => void;
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
  onApply?: () => void;
  onViewDefinition?: () => void;
  onViewSourceData?: () => void;
}

const chartTypes = [
  { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { id: 'line', label: 'Graph', icon: LineChartIcon },
  { id: 'area', label: 'KPI Chart', icon: Gauge },
] as const;

const timePeriods = [
  { value: 0, label: 'L1' },
  { value: 1, label: 'L7' },
  { value: 2, label: 'L28' },
];

const filterOptions = [
  { id: 'dashpass', label: 'Dash Pass Users' },
  { id: 'newly-onboarded', label: 'Newly Onboarded Users' },
  { id: 'consumers', label: 'Consumers' },
  { id: 'merchants', label: 'Merchants' },
];

// New: Dimension options for slice/dice
const dimensionOptions = [
  { id: 'none', label: 'No grouping' },
  { id: 'region', label: 'Region' },
  { id: 'market', label: 'Market' },
  { id: 'city', label: 'City' },
  { id: 'merchant-category', label: 'Merchant Category' },
  { id: 'customer-segment', label: 'Customer Segment' },
  { id: 'day-of-week', label: 'Day of Week' },
];

// New: Measure/aggregation options
const measureOptions = [
  { id: 'count', label: 'Count' },
  { id: 'sum', label: 'Sum' },
  { id: 'average', label: 'Average' },
  { id: 'median', label: 'Median' },
  { id: 'p90', label: '90th Percentile' },
  { id: 'p95', label: '95th Percentile' },
  { id: 'wow', label: 'Week over Week %' },
  { id: 'mom', label: 'Month over Month %' },
  { id: 'yoy', label: 'Year over Year %' },
];

export function WidgetOptionsMenu({
  open,
  onOpenChange,
  currentChartType,
  onChartTypeChange,
  currentTimePeriod,
  onTimePeriodChange,
  selectedFilters,
  onFiltersChange,
  onApply,
  onViewDefinition,
  onViewSourceData,
}: WidgetOptionsMenuProps) {
  const [sliderValue, setSliderValue] = useState([currentTimePeriod]);
  const [customTimePeriodEnabled, setCustomTimePeriodEnabled] = useState(false);
  const [customTimePeriod, setCustomTimePeriod] = useState('');
  const [selectedDimension, setSelectedDimension] = useState('none');
  const [selectedMeasure, setSelectedMeasure] = useState('count');

  // Sync slider value when currentTimePeriod changes or dialog opens
  useEffect(() => {
    setSliderValue([currentTimePeriod]);
  }, [currentTimePeriod, open]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    onTimePeriodChange(value[0]);
    // Turn off custom time period when slider is used
    setCustomTimePeriodEnabled(false);
  };

  const handleCustomToggle = (checked: boolean) => {
    setCustomTimePeriodEnabled(checked);
    if (!checked) {
      // When toggled off, revert to slider value
      setCustomTimePeriod('');
    }
  };

  const toggleFilter = (filterId: string) => {
    if (selectedFilters.includes(filterId)) {
      onFiltersChange(selectedFilters.filter(f => f !== filterId));
    } else {
      onFiltersChange([...selectedFilters, filterId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Widget Options</DialogTitle>
          <DialogDescription>
            Customize the chart type, dimensions, measures, and filters for this widget
          </DialogDescription>
        </DialogHeader>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDefinition}
            className="flex-1 gap-1"
          >
            <Database className="h-4 w-4" />
            View Definition
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewSourceData}
            className="flex-1 gap-1"
          >
            <Database className="h-4 w-4" />
            View Source Data
          </Button>
        </div>

        <Separator />

        {/* Chart Type Selection */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Chart Type</h4>
          <div className="grid grid-cols-3 gap-2">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = currentChartType === type.id;
              return (
                <Button
                  key={type.id}
                  variant={isSelected ? 'default' : 'outline'}
                  className="h-auto flex-col gap-2 py-3"
                  onClick={() => onChartTypeChange(type.id as 'line' | 'area' | 'bar')}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{type.label}</span>
                  {isSelected && <Check className="h-3 w-3 absolute top-1 right-1" />}
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Slice & Dice: Dimension and Measure */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Slice & Dice</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Dimension Selector */}
            <div className="space-y-2">
              <Label htmlFor="dimension" className="text-xs text-muted-foreground">
                Group By Dimension
              </Label>
              <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                <SelectTrigger id="dimension">
                  <SelectValue placeholder="Select dimension" />
                </SelectTrigger>
                <SelectContent>
                  {dimensionOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Measure Selector */}
            <div className="space-y-2">
              <Label htmlFor="measure" className="text-xs text-muted-foreground">
                Aggregation Method
              </Label>
              <Select value={selectedMeasure} onValueChange={setSelectedMeasure}>
                <SelectTrigger id="measure">
                  <SelectValue placeholder="Select measure" />
                </SelectTrigger>
                <SelectContent>
                  {measureOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview of selection */}
          {selectedDimension !== 'none' && (
            <div className="bg-muted p-3 rounded-lg text-xs">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">Analysis Preview:</span>
              </div>
              <span className="font-mono">
                {measureOptions.find(m => m.id === selectedMeasure)?.label} by{' '}
                {dimensionOptions.find(d => d.id === selectedDimension)?.label}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Time Period Slider */}
        <div className="space-y-4">
          <h4 className="text-sm text-muted-foreground">Time Period</h4>
          <div className="space-y-3">
            <Slider
              value={sliderValue}
              onValueChange={handleSliderChange}
              min={0}
              max={2}
              step={1}
              className="w-full"
              disabled={customTimePeriodEnabled}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              {timePeriods.map((period) => (
                <span
                  key={period.value}
                  className={sliderValue[0] === period.value && !customTimePeriodEnabled ? 'text-primary' : ''}
                >
                  {period.label}
                </span>
              ))}
            </div>
          </div>

          {/* Custom Time Period Toggle */}
          <div className="flex items-center justify-between space-x-2 pt-2">
            <Label htmlFor="custom-period" className="text-sm cursor-pointer flex-1">
              Custom Time Period
            </Label>
            <Switch
              id="custom-period"
              checked={customTimePeriodEnabled}
              onCheckedChange={handleCustomToggle}
            />
          </div>

          {/* Custom Time Period Input */}
          {customTimePeriodEnabled && (
            <div className="space-y-2 pt-1">
              <Input
                type="text"
                placeholder="e.g., L14, L60, Last 3 months"
                value={customTimePeriod}
                onChange={(e) => setCustomTimePeriod(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Enter a custom time period (e.g., L14 for last 14 days)
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Filter Pills */}
        <div className="space-y-3">
          <h4 className="text-sm text-muted-foreground">Filters</h4>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => {
              const isSelected = selectedFilters.includes(filter.id);
              return (
                <Badge
                  key={filter.id}
                  variant={isSelected ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1.5 hover:bg-primary/90"
                  onClick={() => toggleFilter(filter.id)}
                >
                  {filter.label}
                  {isSelected && <Check className="h-3 w-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={() => {
              if (onApply) {
                onApply();
              } else {
                onOpenChange(false);
              }
            }} 
            className="w-full"
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
