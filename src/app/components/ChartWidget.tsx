import { useState, type RefCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from './ui/button';
import { X, MoreVertical, BarChart3, Table2 } from 'lucide-react';
import { motion } from 'motion/react';
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

export function ChartWidget({ title, data, type = 'area', dataKey = 'value', valueFormatter, isCustomizing = false, onDelete, isNew = false, id }: ChartWidgetProps) {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>(type);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [timePeriod, setTimePeriod] = useState(0); // 0: L7, 1: L28, 2: YoY
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [definitionModalOpen, setDefinitionModalOpen] = useState(false);
  const [sourceDataModalOpen, setSourceDataModalOpen] = useState(false);

  // Drag functionality
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
        <div className="bg-card border border-border p-2 rounded-lg shadow-lg">
          <p className="text-sm">
            <span className="text-muted-foreground">{payload[0].payload.name}: </span>
            <span>{valueFormatter ? valueFormatter(value) : value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="relative h-full"
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
      <div ref={drag as unknown as RefCallback<HTMLDivElement>} className="h-full">
        <Card className={`hover:shadow-lg transition-shadow h-full flex flex-col ${isCustomizing ? 'widget-wiggle' : ''} ${isNew ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle>{title}</CardTitle>
                {/* Show active filters and time period */}
                {(selectedFilters.length > 0 || timePeriod !== 0) && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {timePeriod === 1 && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">L7</span>
                    )}
                    {timePeriod === 2 && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">L28</span>
                    )}
                    {selectedFilters.length > 0 && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {selectedFilters.length} filter{selectedFilters.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {/* View Toggle Buttons */}
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant={viewMode === 'chart' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-7 w-7 rounded-r-none border-r"
                    onClick={() => setViewMode('chart')}
                    title="Chart view"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-7 w-7 rounded-l-none"
                    onClick={() => setViewMode('table')}
                    title="Table view"
                  >
                    <Table2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setOptionsMenuOpen(true)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            {viewMode === 'chart' ? (
              <div className="w-full h-[300px]">
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
              </div>
            ) : (
              <div className="w-full h-[300px] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/50 backdrop-blur-sm border-b">
                    <tr>
                      <th className="text-left p-2 font-medium">Name</th>
                      <th className="text-right p-2 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr 
                        key={index} 
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-2">{row.name}</td>
                        <td className="p-2 text-right font-medium tabular-nums">
                          {(row[dataKey] as number).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Delete button in customization mode */}
        {isCustomizing && onDelete && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg z-10"
            onClick={onDelete}
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        {/* New widget indicator */}
        {isNew && (
          <motion.div
            className="absolute -top-1 -right-1 z-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
          >
            <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs shadow-lg">
              New
            </div>
          </motion.div>
        )}

        {/* Widget Options Menu */}
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

        {/* Metric Definition Modal */}
        <MetricDefinitionModal
          open={definitionModalOpen}
          onOpenChange={(open) => {
            setDefinitionModalOpen(open);
            // When closing the definition modal, re-open the widget options menu
            if (!open) {
              setOptionsMenuOpen(true);
            }
          }}
          metricTitle={title}
          metricId={id}
        />

        {/* Source Data Table Modal */}
        <SourceDataTableModal
          open={sourceDataModalOpen}
          onOpenChange={(open) => {
            setSourceDataModalOpen(open);
            // When closing the source data modal, re-open the widget options menu
            if (!open) {
              setOptionsMenuOpen(true);
            }
          }}
          metricTitle={title}
          chartData={data}
        />
      </div>
    </motion.div>
  );
}
