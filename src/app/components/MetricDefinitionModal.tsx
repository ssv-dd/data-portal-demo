import styled from 'styled-components';
import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Code, Database, User, Clock, ExternalLink, Copy, Download, ArrowLeft } from 'lucide-react';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';
import { toast } from '@/app/lib/toast';

interface MetricDefinitionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricTitle: string;
  metricId?: string;
}

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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.large};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const TagsAndActions = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${Theme.usage.space.medium};
`;

const TagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${Theme.usage.space.xSmall};
  flex: 1;
`;

const ActionsWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  flex-shrink: 0;
`;

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const SectionTitle = styled.h3`
  font-weight: 600;
`;

const LogicBox = styled.div`
  background-color: ${colors.muted};
  border-radius: ${radius.lg};
  padding: ${Theme.usage.space.medium};
`;

const LogicList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
  font-size: ${Theme.usage.fontSize.xSmall};
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LogicItem = styled.li`
  display: flex;
  gap: ${Theme.usage.space.xSmall};
`;

const LogicNumber = styled.span`
  color: ${colors.mutedForeground};
  flex-shrink: 0;
`;

const SqlHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SqlBox = styled.div`
  background-color: ${colors.slate950};
  color: ${colors.slate50};
  border-radius: ${radius.lg};
  padding: ${Theme.usage.space.medium};
  overflow-x: auto;
`;

const SqlPre = styled.pre`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  white-space: pre;
`;

const SourcesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const SourceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.small};
  background-color: ${colors.muted};
  border-radius: ${radius.lg};
  transition: background-color 150ms;

  &:hover {
    background-color: rgba(236, 236, 240, 0.8);
  }
`;

const SourceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const SourceName = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${Theme.usage.space.medium};
`;

const MetadataBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const MetadataLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

const MetadataValue = styled.div`
  font-weight: 500;
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const MetadataSubtext = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={metricTitle}>
      <DialogContent style={{ maxWidth: '768px', maxHeight: '80vh', overflowY: 'auto' }}>
          <HeaderRow>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              style={{ gap: '4px', marginLeft: '-8px' }}
            >
              <ArrowLeft style={{ height: '16px', width: '16px' }} />
              Back
            </Button>
          </HeaderRow>
          <DialogDescription>{definition.description}</DialogDescription>

        <ContentWrapper>
          <TagsAndActions>
            <TagsWrap>
              {definition.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </TagsWrap>
            <ActionsWrap>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
                style={{ gap: '4px' }}
              >
                <Download style={{ height: '14px', width: '14px' }} />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('excel')}
                style={{ gap: '4px' }}
              >
                <Download style={{ height: '14px', width: '14px' }} />
                Excel
              </Button>
            </ActionsWrap>
          </TagsAndActions>

          <Separator />

          <SectionBlock>
            <SectionHeader>
              <Code style={{ height: '16px', width: '16px', color: colors.mutedForeground }} />
              <SectionTitle>Metric Logic</SectionTitle>
            </SectionHeader>
            <LogicBox>
              <LogicList>
                {definition.logic.map((step: string, index: number) => (
                  <LogicItem key={index}>
                    <LogicNumber>
                      {step.startsWith('  •') ? '  •' : `${index + 1}.`}
                    </LogicNumber>
                    <span>{step.replace('  • ', '')}</span>
                  </LogicItem>
                ))}
              </LogicList>
            </LogicBox>
          </SectionBlock>

          <Separator />

          <SectionBlock>
            <SqlHeaderRow>
              <SectionHeader>
                <Database style={{ height: '16px', width: '16px', color: colors.mutedForeground }} />
                <SectionTitle>SQL Query</SectionTitle>
              </SectionHeader>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(definition.sqlQuery)}
                style={{ gap: '4px' }}
              >
                <Copy style={{ height: '12px', width: '12px' }} />
                Copy
              </Button>
            </SqlHeaderRow>
            <SqlBox>
              <SqlPre>{definition.sqlQuery}</SqlPre>
            </SqlBox>
          </SectionBlock>

          <Separator />

          <SectionBlock>
            <SectionHeader>
              <Database style={{ height: '16px', width: '16px', color: colors.mutedForeground }} />
              <SectionTitle>Data Sources</SectionTitle>
            </SectionHeader>
            <SourcesList>
              {definition.dataSources.map((source: any, index: number) => (
                <SourceItem key={index}>
                  <SourceInfo>
                    <Badge variant="outline" style={{ fontSize: '12px' }}>
                      {source.type}
                    </Badge>
                    <SourceName>{source.name}</SourceName>
                  </SourceInfo>
                  <Button variant="ghost" size="sm" style={{ gap: '4px' }}>
                    <ExternalLink style={{ height: '12px', width: '12px' }} />
                    View
                  </Button>
                </SourceItem>
              ))}
            </SourcesList>
          </SectionBlock>

          <Separator />

          <MetadataGrid>
            <MetadataBlock>
              <MetadataLabel>
                <User style={{ height: '16px', width: '16px' }} />
                <span>Owner</span>
              </MetadataLabel>
              <div>
                <MetadataValue>{definition.owner}</MetadataValue>
                <MetadataSubtext>{definition.ownerTeam}</MetadataSubtext>
              </div>
            </MetadataBlock>
            <MetadataBlock>
              <MetadataLabel>
                <Clock style={{ height: '16px', width: '16px' }} />
                <span>Last Updated</span>
              </MetadataLabel>
              <div>
                <div style={{ fontSize: '14px' }}>{definition.lastUpdated}</div>
                <MetadataSubtext>
                  Refreshes: {definition.refreshCadence}
                </MetadataSubtext>
              </div>
            </MetadataBlock>
          </MetadataGrid>
        </ContentWrapper>
      </DialogContent>
    </Dialog>
  );
}
