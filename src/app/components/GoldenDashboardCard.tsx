import { Card } from './ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer } from 'recharts';

export interface GoldenDashboard {
  id: string;
  title: string;
  description: string;
  chartType: 'line' | 'area' | 'bar';
  data: Array<Record<string, unknown>>;
  dataKey: string;
  color: string;
}

interface GoldenDashboardCardProps {
  dashboard: GoldenDashboard;
  onClick?: () => void;
  compact?: boolean;
}

export function GoldenDashboardCard({ dashboard, onClick, compact = false }: GoldenDashboardCardProps) {
  const renderChart = () => {
    const chartProps = {
      data: dashboard.data,
      margin: { top: 5, right: 5, left: 5, bottom: 5 }
    };

    switch (dashboard.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...chartProps}>
              <Line 
                type="monotone" 
                dataKey={dashboard.dataKey} 
                stroke={dashboard.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...chartProps}>
              <Area 
                type="monotone" 
                dataKey={dashboard.dataKey} 
                fill={dashboard.color}
                fillOpacity={0.6}
                stroke={dashboard.color}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...chartProps}>
              <Bar dataKey={dashboard.dataKey} fill={dashboard.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card 
      className={`${compact ? 'p-4' : 'p-6'} hover:shadow-lg transition-all cursor-pointer group ${compact ? 'border hover:border-purple-500/30' : 'border-2 hover:border-purple-500/50'}`}
      onClick={onClick}
    >
      <div className={compact ? 'space-y-2' : 'space-y-4'}>
        <div>
          <h3 className={`${compact ? 'text-sm' : 'font-semibold'} mb-1 group-hover:text-purple-600 transition-colors`}>
            {dashboard.title}
          </h3>
          <p className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground`}>{dashboard.description}</p>
        </div>
        
        {/* Chart Thumbnail */}
        <div 
          className={`w-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg overflow-hidden`} 
          style={{ width: '100%', height: compact ? '100px' : '160px' }}
        >
          {renderChart()}
        </div>
      </div>
    </Card>
  );
}
