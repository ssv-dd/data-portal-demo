import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Code, Database, User, Clock, ExternalLink, Copy, Download, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface MetricDefinitionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricTitle: string;
  metricId?: string;
}

// Mock data - would come from backend in real implementation
const getMetricDefinition = (title: string) => {
  const definitions: Record<string, any> = {
    'Monthly Active Users (MAU)': {
      description: 'Count of unique users who placed at least one order in the last 28 days',
      sqlQuery: `SELECT 
  COUNT(DISTINCT user_id) as mau,
  DATE_TRUNC('month', order_date) as month
FROM orders.completed_orders
WHERE order_date >= CURRENT_DATE - INTERVAL '6 months'
  AND order_status = 'delivered'
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month DESC`,
      logic: [
        'Count distinct user_id from completed orders',
        'Filter for orders in last 28 days',
        'Only include successfully delivered orders',
        'Exclude test accounts and internal users',
      ],
      dataSources: [
        { name: 'orders.completed_orders', type: 'Table' },
        { name: 'users.user_metadata', type: 'Table' },
      ],
      owner: 'Sarah Chen',
      ownerTeam: 'Consumer Analytics',
      lastUpdated: '2025-01-27 08:30 AM PST',
      refreshCadence: 'Daily at 6:00 AM PST',
      tags: ['Core Metric', 'Executive Dashboard', 'Consumer'],
    },
    'Gross Order Value (GOV)': {
      description: 'Total dollar value of all completed orders, including fees and tips',
      sqlQuery: `SELECT 
  SUM(subtotal + delivery_fee + tip + tax) as gov,
  AVG(subtotal + delivery_fee + tip + tax) as aov,
  DATE_TRUNC('month', order_date) as month
FROM orders.completed_orders
WHERE order_date >= CURRENT_DATE - INTERVAL '6 months'
  AND order_status = 'delivered'
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month DESC`,
      logic: [
        'Sum all order value components (subtotal + fees + tip + tax)',
        'Only include delivered orders',
        'Calculate average order value (AOV) as total/count',
        'Exclude refunded or cancelled orders',
      ],
      dataSources: [
        { name: 'orders.completed_orders', type: 'Table' },
        { name: 'orders.order_financials', type: 'Table' },
      ],
      owner: 'Marcus Williams',
      ownerTeam: 'Finance Analytics',
      lastUpdated: '2025-01-27 07:15 AM PST',
      refreshCadence: 'Hourly',
      tags: ['Core Metric', 'Financial', 'Executive Dashboard'],
    },
    'High Quality Delivery Rate (HQDR)': {
      description: 'Percentage of deliveries meeting quality standards (on-time, accurate, no issues)',
      sqlQuery: `SELECT 
  (COUNT(CASE WHEN is_high_quality = TRUE THEN 1 END) * 100.0 / COUNT(*)) as hqdr,
  DATE_TRUNC('month', delivery_date) as month
FROM deliveries.delivery_quality
WHERE delivery_date >= CURRENT_DATE - INTERVAL '6 months'
  AND delivery_status = 'completed'
GROUP BY DATE_TRUNC('month', delivery_date)
ORDER BY month DESC`,
      logic: [
        'Delivery is "high quality" if all conditions met:',
        '  • Delivered within promised time window',
        '  • No customer complaints or issues reported',
        '  • Order accuracy confirmed',
        '  • Dasher rating >= 4.5',
        'Calculate as (high quality deliveries / total deliveries) * 100',
      ],
      dataSources: [
        { name: 'deliveries.delivery_quality', type: 'Table' },
        { name: 'deliveries.dasher_ratings', type: 'Table' },
        { name: 'support.customer_issues', type: 'Table' },
      ],
      owner: 'Priya Patel',
      ownerTeam: 'Operations Analytics',
      lastUpdated: '2025-01-27 06:45 AM PST',
      refreshCadence: 'Every 4 hours',
      tags: ['Core Metric', 'Quality', 'Operations'],
    },
  };

  return definitions[title] || definitions['Monthly Active Users (MAU)'];
};

export function MetricDefinitionModal({
  open,
  onOpenChange,
  metricTitle,
  metricId: _metricId,
}: MetricDefinitionModalProps) {
  const definition = getMetricDefinition(metricTitle);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleExport = (format: 'csv' | 'excel') => {
    toast.success(`Exporting ${metricTitle} data to ${format.toUpperCase()}...`);
    // Real implementation would generate and download file
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="gap-1 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <DialogTitle className="text-xl">{metricTitle}</DialogTitle>
          <DialogDescription>{definition.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tags and Export Actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap gap-2 flex-1">
              {definition.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
                className="gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('excel')}
                className="gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                Excel
              </Button>
            </div>
          </div>

          <Separator />

          {/* Metric Logic */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Metric Logic</h3>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <ul className="space-y-2 text-sm">
                {definition.logic.map((step: string, index: number) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-muted-foreground shrink-0">
                      {step.startsWith('  •') ? '  •' : `${index + 1}.`}
                    </span>
                    <span>{step.replace('  • ', '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator />

          {/* SQL Query */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">SQL Query</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(definition.sqlQuery)}
                className="gap-1"
              >
                <Copy className="h-3 w-3" />
                Copy
              </Button>
            </div>
            <div className="bg-slate-950 text-slate-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs font-mono whitespace-pre">{definition.sqlQuery}</pre>
            </div>
          </div>

          <Separator />

          {/* Data Sources */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Data Sources</h3>
            </div>
            <div className="space-y-2">
              {definition.dataSources.map((source: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {source.type}
                    </Badge>
                    <span className="text-sm font-mono">{source.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ExternalLink className="h-3 w-3" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Owner</span>
              </div>
              <div>
                <div className="font-medium text-sm">{definition.owner}</div>
                <div className="text-xs text-muted-foreground">{definition.ownerTeam}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last Updated</span>
              </div>
              <div>
                <div className="text-sm">{definition.lastUpdated}</div>
                <div className="text-xs text-muted-foreground">
                  Refreshes: {definition.refreshCadence}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
