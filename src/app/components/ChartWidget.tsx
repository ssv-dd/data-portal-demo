import { useState, type RefCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from './ui/button';
import { X, MoreVertical, BarChart3, Table2 } from 'lucide-react';
import { motion } from 'framer-motion';
import styled, { css, keyframes } from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, radius, shadows } from '@/styles/theme';
import { WidgetOptionsMenu } from './WidgetOptionsMenu';
import { MetricDefinitionModal } from './MetricDefinitionModal';
import { SourceDataTableModal } from './SourceDataTableModal';
import { useDrag } from 'react-dnd';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface ChartWidgetProps {
  title: string;
  data: ChartData[];
  type?: 'line' | 'area' | 'bar';
  dataKey?: string;
  valueFormatter?: (value: number) => string;
  isCustomizing?: boolean;
  onDelete?: () => void;
  isNew?: boolean;
  id?: string;
}

const wiggle = keyframes`
  0%, 100% { transform: rotate(-0.5deg); }
  50% { transform: rotate(0.5deg); }
`;

const WidgetWrapper = styled(motion.div)`
  position: relative;
  height: 100%;
`;

const DragContainer = styled.div`
  height: 100%;
`;

const StyledCard = styled(Card)<{ $isCustomizing: boolean; $isNew: boolean }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: box-shadow 200ms;

  &:hover {
    box-shadow: ${shadows.lg};
  }

  ${({ $isCustomizing }) =>
    $isCustomizing &&
    css`
      animation: ${wiggle} 0.3s ease-in-out infinite alternate;
    `}

  ${({ $isNew }) =>
    $isNew &&
    css`
      box-shadow: 0 0 0 2px ${colors.background}, 0 0 0 4px ${colors.primary};
    `}
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleArea = styled.div`
  flex: 1;
`;

const FiltersRow = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xxSmall};
  margin-top: ${Theme.usage.space.xxSmall};
  flex-wrap: wrap;
`;

const FilterBadge = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  background-color: ${colors.muted};
  padding: ${Theme.usage.space.xxxSmall} ${Theme.usage.space.xSmall};
  border-radius: ${radius.sm};
`;

const ActionsArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  flex-shrink: 0;
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
`;

const ToggleButtonLeft = styled(Button)`
  height: 28px;
  width: 28px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: 1px solid ${colors.border};
`;

const ToggleButtonRight = styled(Button)`
  height: 28px;
  width: 28px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const StyledCardContent = styled(CardContent)`
  flex: 1;
  min-height: 0;
`;

const ChartArea = styled.div`
  width: 100%;
  height: 300px;
`;

const TableArea = styled.div`
  width: 100%;
  height: 300px;
  overflow: auto;
`;

const DataTable = styled.table`
  width: 100%;
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const TableHead = styled.thead`
  position: sticky;
  top: 0;
  background: rgb(var(--app-muted-rgb) / 0.5);
  backdrop-filter: blur(4px);
  border-bottom: 1px solid ${colors.border};
`;

const Th = styled.th<{ $align?: string }>`
  text-align: ${({ $align }) => $align || 'left'};
  padding: ${Theme.usage.space.xSmall};
  font-weight: 500;
`;

const Tr = styled.tr`
  border-bottom: 1px solid ${colors.border};
  transition: background-color 150ms;

  &:hover {
    background: rgb(var(--app-muted-rgb) / 0.3);
  }
`;

const Td = styled.td<{ $align?: string }>`
  padding: ${Theme.usage.space.xSmall};
  text-align: ${({ $align }) => $align || 'left'};
  ${({ $align }) =>
    $align === 'right' &&
    css`
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    `}
`;

const TooltipBox = styled.div`
  background-color: ${colors.card};
  border: 1px solid ${colors.border};
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${radius.lg};
  box-shadow: ${shadows.lg};
`;

const TooltipLabel = styled.span`
  color: ${colors.mutedForeground};
`;

const DeleteButton = styled(Button)`
  position: absolute;
  top: -8px;
  right: -8px;
  height: 24px;
  width: 24px;
  border-radius: ${Theme.usage.borderRadius.full};
  box-shadow: ${shadows.lg};
  z-index: 10;
`;

const NewIndicator = styled(motion.div)`
  position: absolute;
  top: -4px;
  right: -4px;
  z-index: 20;
`;

const NewBadge = styled.div`
  background-color: ${colors.primary};
  color: ${colors.primaryForeground};
  padding: ${Theme.usage.space.xxxSmall} ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.full};
  font-size: ${Theme.usage.fontSize.xxSmall};
  box-shadow: ${shadows.lg};
`;

export function ChartWidget({ title, data, type = 'area', dataKey = 'value', valueFormatter, isCustomizing = false, onDelete, isNew = false, id }: ChartWidgetProps) {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>(type);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [timePeriod, setTimePeriod] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [definitionModalOpen, setDefinitionModalOpen] = useState(false);
  const [sourceDataModalOpen, setSourceDataModalOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'metric',
    item: { 
      id: `metric-${title}`, 
      title,
      type: 'metric' as const
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <TooltipBox>
          <p style={{ fontSize: '14px' }}>
            <TooltipLabel>{payload[0].payload.name}: </TooltipLabel>
            <span>{valueFormatter ? valueFormatter(value) : value.toLocaleString()}</span>
          </p>
        </TooltipBox>
      );
    }
    return null;
  };

  return (
    <WidgetWrapper
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
      initial={isNew ? { scale: 0.95, opacity: 0 } : false}
      animate={isNew ? { 
        scale: [0.95, 1.02, 1],
        opacity: 1,
      } : {}}
      transition={{ 
        duration: 0.5,
        ease: "easeOut"
      }}
    >
      <DragContainer ref={drag as unknown as RefCallback<HTMLDivElement>}>
        <StyledCard $isCustomizing={isCustomizing} $isNew={isNew}>
          <CardHeader>
            <HeaderRow>
              <TitleArea>
                <CardTitle>{title}</CardTitle>
                {(selectedFilters.length > 0 || timePeriod !== 0) && (
                  <FiltersRow>
                    {timePeriod === 1 && <FilterBadge>L7</FilterBadge>}
                    {timePeriod === 2 && <FilterBadge>L28</FilterBadge>}
                    {selectedFilters.length > 0 && (
                      <FilterBadge>
                        {selectedFilters.length} filter{selectedFilters.length > 1 ? 's' : ''}
                      </FilterBadge>
                    )}
                  </FiltersRow>
                )}
              </TitleArea>
              <ActionsArea>
                <ViewToggle>
                  <ToggleButtonLeft
                    variant={viewMode === 'chart' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('chart')}
                    title="Chart view"
                  >
                    <BarChart3 style={{ width: 14, height: 14 }} />
                  </ToggleButtonLeft>
                  <ToggleButtonRight
                    variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('table')}
                    title="Table view"
                  >
                    <Table2 style={{ width: 14, height: 14 }} />
                  </ToggleButtonRight>
                </ViewToggle>
                <Button
                  variant="ghost"
                  size="icon"
                  style={{ height: 32, width: 32 }}
                  onClick={() => setOptionsMenuOpen(true)}
                >
                  <MoreVertical style={{ width: 16, height: 16 }} />
                </Button>
              </ActionsArea>
            </HeaderRow>
          </CardHeader>
          <StyledCardContent>
            {viewMode === 'chart' ? (
              <ChartArea>
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={data} margin={{ left: 10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis width={70} tickFormatter={(value) => valueFormatter ? valueFormatter(value) : value.toLocaleString()} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey={dataKey} stroke="hsl(var(--chart-1))" strokeWidth={2} />
                    </LineChart>
                  ) : chartType === 'bar' ? (
                    <BarChart data={data} margin={{ left: 10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis width={70} tickFormatter={(value) => valueFormatter ? valueFormatter(value) : value.toLocaleString()} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey={dataKey} fill="hsl(var(--chart-1))" />
                    </BarChart>
                  ) : (
                    <AreaChart data={data} margin={{ left: 10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis width={70} tickFormatter={(value) => valueFormatter ? valueFormatter(value) : value.toLocaleString()} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey={dataKey} stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.2} />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </ChartArea>
            ) : (
              <TableArea>
                <DataTable>
                  <TableHead>
                    <tr>
                      <Th>Name</Th>
                      <Th $align="right">Value</Th>
                    </tr>
                  </TableHead>
                  <tbody>
                    {data.map((row, index) => (
                      <Tr key={index}>
                        <Td>{row.name}</Td>
                        <Td $align="right">
                          {(row[dataKey] as number).toLocaleString()}
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </DataTable>
              </TableArea>
            )}
          </StyledCardContent>
        </StyledCard>
        
        {isCustomizing && onDelete && (
          <DeleteButton
            size="icon"
            variant="destructive"
            onClick={onDelete}
          >
            <X style={{ width: 12, height: 12 }} />
          </DeleteButton>
        )}

        {isNew && (
          <NewIndicator
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
          >
            <NewBadge>New</NewBadge>
          </NewIndicator>
        )}

        <WidgetOptionsMenu
          open={optionsMenuOpen}
          onOpenChange={setOptionsMenuOpen}
          currentChartType={chartType}
          onChartTypeChange={setChartType}
          currentTimePeriod={timePeriod}
          onTimePeriodChange={setTimePeriod}
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
          onViewDefinition={() => {
            setOptionsMenuOpen(false);
            setDefinitionModalOpen(true);
          }}
          onViewSourceData={() => {
            setOptionsMenuOpen(false);
            setSourceDataModalOpen(true);
          }}
        />

        <MetricDefinitionModal
          open={definitionModalOpen}
          onOpenChange={(open) => {
            setDefinitionModalOpen(open);
            if (!open) {
              setOptionsMenuOpen(true);
            }
          }}
          metricTitle={title}
          metricId={id}
        />

        <SourceDataTableModal
          open={sourceDataModalOpen}
          onOpenChange={(open) => {
            setSourceDataModalOpen(open);
            if (!open) {
              setOptionsMenuOpen(true);
            }
          }}
          metricTitle={title}
          chartData={data}
        />
      </DragContainer>
    </WidgetWrapper>
  );
}
