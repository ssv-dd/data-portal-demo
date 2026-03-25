import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Dialog, DialogContent, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BarChart3, LineChart as LineChartIcon, Gauge, Check, Database, TrendingUp } from 'lucide-react';
import { Separator } from './ui/separator';
import { colors, radius } from '@/styles/theme';
import { Select, Theme } from '@doordash/prism-react';

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

const dimensionOptions = [
  { id: 'none', label: 'No grouping' },
  { id: 'region', label: 'Region' },
  { id: 'market', label: 'Market' },
  { id: 'city', label: 'City' },
  { id: 'merchant-category', label: 'Merchant Category' },
  { id: 'customer-segment', label: 'Customer Segment' },
  { id: 'day-of-week', label: 'Day of Week' },
];

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

const QuickActions = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xSmall};
`;

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`;

const SectionTitle = styled.h4`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
`;

const SectionSubtitle = styled.h4`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${Theme.usage.space.xSmall};
`;

const SliceDiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${Theme.usage.space.small};
`;

const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const PreviewBox = styled.div`
  background-color: ${colors.muted};
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  font-size: ${Theme.usage.fontSize.xxSmall};
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const CustomPeriodRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${Theme.usage.space.xSmall};
  padding-top: ${Theme.usage.space.xSmall};
`;

const CustomInputBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
  padding-top: ${Theme.usage.space.xxSmall};
`;

const CustomHint = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const FilterWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${Theme.usage.space.xSmall};
`;

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

  useEffect(() => {
    setSliderValue([currentTimePeriod]);
  }, [currentTimePeriod, open]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    onTimePeriodChange(value[0]);
    setCustomTimePeriodEnabled(false);
  };

  const handleCustomToggle = (checked: boolean) => {
    setCustomTimePeriodEnabled(checked);
    if (!checked) {
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
    <Dialog open={open} onOpenChange={onOpenChange} title="Widget Options">
      <DialogContent style={{ maxWidth: '672px', maxHeight: '90vh', overflowY: 'auto' }}>
          <DialogDescription>
            Customize the chart type, dimensions, measures, and filters for this widget
          </DialogDescription>

        <QuickActions>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDefinition}
            style={{ flex: 1, gap: '4px' }}
          >
            <Database style={{ height: '16px', width: '16px' }} />
            View Definition
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewSourceData}
            style={{ flex: 1, gap: '4px' }}
          >
            <Database style={{ height: '16px', width: '16px' }} />
            View Source Data
          </Button>
        </QuickActions>

        <Separator />

        <SectionBlock>
          <SectionTitle>Chart Type</SectionTitle>
          <ChartGrid>
            {chartTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = currentChartType === type.id;
              return (
                <Button
                  key={type.id}
                  variant={isSelected ? 'default' : 'outline'}
                  style={{
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '12px',
                    position: 'relative',
                  }}
                  onClick={() => onChartTypeChange(type.id as 'line' | 'area' | 'bar')}
                >
                  <Icon style={{ height: '20px', width: '20px' }} />
                  <span style={{ fontSize: '12px' }}>{type.label}</span>
                  {isSelected && <Check style={{ height: '12px', width: '12px', position: 'absolute', top: '4px', right: '4px' }} />}
                </Button>
              );
            })}
          </ChartGrid>
        </SectionBlock>

        <Separator />

        <SectionBlock style={{ gap: '16px' }}>
          <SectionTitle>Slice & Dice</SectionTitle>
          
          <SliceDiceGrid>
            <FieldBlock>
              <Select
                label="Group By Dimension"
                value={selectedDimension}
                onChange={(v) => setSelectedDimension(v)}
                options={dimensionOptions.map(o => ({ name: o.label, value: o.id }))}
              />
            </FieldBlock>

            <FieldBlock>
              <Select
                label="Aggregation Method"
                value={selectedMeasure}
                onChange={(v) => setSelectedMeasure(v)}
                options={measureOptions.map(o => ({ name: o.label, value: o.id }))}
              />
            </FieldBlock>
          </SliceDiceGrid>

          {selectedDimension !== 'none' && (
            <PreviewBox>
              <PreviewHeader>
                <TrendingUp style={{ height: '12px', width: '12px' }} />
                <span style={{ fontWeight: 500 }}>Analysis Preview:</span>
              </PreviewHeader>
              <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                {measureOptions.find(m => m.id === selectedMeasure)?.label} by{' '}
                {dimensionOptions.find(d => d.id === selectedDimension)?.label}
              </span>
            </PreviewBox>
          )}
        </SectionBlock>

        <Separator />

        <SectionBlock style={{ gap: '16px' }}>
          <SectionSubtitle>Time Period</SectionSubtitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Slider
              value={sliderValue}
              onValueChange={handleSliderChange}
              min={0}
              max={2}
              step={1}
              style={{ width: '100%' }}
              disabled={customTimePeriodEnabled}
            />
            <SliderLabels>
              {timePeriods.map((period) => (
                <span
                  key={period.value}
                  style={{
                    color: sliderValue[0] === period.value && !customTimePeriodEnabled ? colors.primary : undefined
                  }}
                >
                  {period.label}
                </span>
              ))}
            </SliderLabels>
          </div>

          <CustomPeriodRow>
            <Label htmlFor="custom-period" style={{ fontSize: '14px', cursor: 'pointer', flex: 1 }}>
              Custom Time Period
            </Label>
            <Switch
              id="custom-period"
              checked={customTimePeriodEnabled}
              onCheckedChange={handleCustomToggle}
            />
          </CustomPeriodRow>

          {customTimePeriodEnabled && (
            <CustomInputBlock>
              <Input
                type="text"
                placeholder="e.g., L14, L60, Last 3 months"
                value={customTimePeriod}
                onChange={(e) => setCustomTimePeriod(e.target.value)}
                style={{ width: '100%' }}
              />
              <CustomHint>
                Enter a custom time period (e.g., L14 for last 14 days)
              </CustomHint>
            </CustomInputBlock>
          )}
        </SectionBlock>

        <Separator />

        <SectionBlock>
          <SectionSubtitle>Filters</SectionSubtitle>
          <FilterWrap>
            {filterOptions.map((filter) => {
              const isSelected = selectedFilters.includes(filter.id);
              return (
                <Badge
                  key={filter.id}
                  variant={isSelected ? 'default' : 'outline'}
                  style={{ cursor: 'pointer', padding: '4px 12px' }}
                  onClick={() => toggleFilter(filter.id)}
                >
                  {filter.label}
                  {isSelected && <Check style={{ height: '12px', width: '12px', marginLeft: '4px' }} />}
                </Badge>
              );
            })}
          </FilterWrap>
        </SectionBlock>

        <DialogFooter>
          <Button 
            onClick={() => {
              if (onApply) {
                onApply();
              } else {
                onOpenChange(false);
              }
            }} 
            style={{ width: '100%' }}
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
