import { useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, Theme } from '@doordash/prism-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Sparkles, Code, Table, Play, Save, Eye, Edit3, ChevronRight, Check, X } from 'lucide-react';
import { SourceTableModal } from './SourceTableModal';
import { colors, radius } from '@/styles/theme';
import { toast } from '@/app/lib/toast';

interface MetricBuilderModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'executive' | 'analyst';
}

const dimensions = [
  { id: 'time', name: 'Time Period', options: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'QTD', 'YTD'] },
  { id: 'region', name: 'Region', options: ['All Regions', 'North America', 'EMEA', 'APAC', 'LATAM'] },
  { id: 'product', name: 'Product Category', options: ['All Products', 'DashPass', 'Marketplace', 'Drive'] },
  { id: 'customer', name: 'Customer Segment', options: ['All Customers', 'New', 'Returning', 'VIP'] }
];

const measures = [
  { id: 'sum', name: 'Sum', description: 'Total of all values' },
  { id: 'avg', name: 'Average', description: 'Mean value' },
  { id: 'count', name: 'Count', description: 'Number of records' },
  { id: 'median', name: 'Median', description: 'Middle value' },
  { id: 'custom', name: 'Custom Calculation', description: 'Write your own formula' }
];

const previewData = [
  { region: 'North America', value: '$45.2M', change: '+12%' },
  { region: 'EMEA', value: '$32.1M', change: '+8%' },
  { region: 'APAC', value: '$28.5M', change: '+15%' },
  { region: 'LATAM', value: '$12.3M', change: '+5%' }
];

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.large};
`;

const ModeSelector = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xxSmall};
  background-color: ${colors.muted};
  border-radius: ${radius.lg};
`;

const AISection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
`;

const InputRow = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xSmall};
  margin-top: ${Theme.usage.space.xSmall};
`;

const AICardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.small};
`;

const AICardTitle = styled.div`
  font-weight: 500;
  font-size: ${Theme.usage.fontSize.xSmall};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const AICardDesc = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const ConfigSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
  margin-top: ${Theme.usage.space.medium};
`;

const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${Theme.usage.space.small};
`;

const PreviewBox = styled.div`
  margin-top: ${Theme.usage.space.medium};
  padding: ${Theme.usage.space.small};
  background-color: ${colors.background};
  border-radius: ${radius.lg};
  border: 1px solid ${colors.border};
`;

const PreviewHeader = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  margin-bottom: ${Theme.usage.space.xSmall};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const PreviewRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const PreviewRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${Theme.usage.fontSize.xxSmall};
`;

const MutedText = styled.span`
  color: ${colors.mutedForeground};
`;

const PreviewValue = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const QueryLink = styled.button`
  margin-top: ${Theme.usage.space.medium};
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.primary};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const MeasureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${Theme.usage.space.xSmall};
  margin-top: ${Theme.usage.space.xSmall};
`;

const MeasureCard = styled(Card)<{ $selected: boolean }>`
  padding: ${Theme.usage.space.small};
  cursor: pointer;
  transition: all 200ms;
  border-color: ${({ $selected }) => $selected ? colors.primary : undefined};
  background-color: ${({ $selected }) => $selected ? 'rgba(3, 2, 19, 0.05)' : undefined};

  &:hover {
    border-color: rgba(3, 2, 19, 0.5);
  }
`;

const MeasureHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const MeasureName = styled.div`
  font-weight: 500;
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const MeasureDesc = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const DimensionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${Theme.usage.space.small};
  margin-top: ${Theme.usage.space.xSmall};
`;

const DataSourceRow = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xSmall};
  margin-top: ${Theme.usage.space.xSmall};
`;

const QueryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const QueryActions = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xSmall};
`;

const WarningBox = styled.div`
  padding: ${Theme.usage.space.small};
  background-color: #fefce8;
  border: 1px solid #fef08a;
  border-radius: ${radius.lg};
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const WarningContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xSmall};
`;

const WarningText = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: #854d0e;
`;

const ValidationRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const PreviewTableWrap = styled.div`
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  overflow: hidden;
`;

const PreviewTableHeader = styled.div`
  background-color: ${colors.muted};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.medium};
  border-bottom: 1px solid ${colors.border};
`;

const PreviewTableScroll = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const StyledTh = styled.th<{ $align?: string }>`
  text-align: ${({ $align }) => $align || 'left'};
  padding: ${Theme.usage.space.small};
  font-weight: 500;
`;

const StyledTd = styled.td<{ $align?: string }>`
  padding: ${Theme.usage.space.small};
  text-align: ${({ $align }) => $align || 'left'};
`;

const StyledTr = styled.tr`
  border-top: 1px solid ${colors.border};
`;

const ExecQueryCard = styled(Card)`
  padding: ${Theme.usage.space.medium};
  background-color: rgba(236, 236, 240, 0.5);
`;

const ExecQueryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.small};
`;

const ExecQueryPre = styled.pre`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: ${Theme.usage.fontSize.xxSmall};
  background-color: ${colors.background};
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.md};
  border: 1px solid ${colors.border};
  overflow-x: auto;
`;

const ExecQueryFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${Theme.usage.space.small};
  padding-top: ${Theme.usage.space.small};
  border-top: 1px solid ${colors.border};
`;

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${Theme.usage.space.medium};
  border-top: 1px solid ${colors.border};
`;

const FooterRight = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xSmall};
`;

export function MetricBuilderModal({ open, onClose, mode }: MetricBuilderModalProps) {
  const [creationMode, setCreationMode] = useState<'ai' | 'manual'>('ai');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerated, setAiGenerated] = useState(false);
  const [metricName, setMetricName] = useState('');
  const [selectedMeasure, setSelectedMeasure] = useState('avg');
  const [selectedDimensions, setSelectedDimensions] = useState({
    time: 'Last 30 days',
    region: 'All Regions',
    product: 'All Products',
    customer: 'All Customers'
  });
  const [queryEditMode, setQueryEditMode] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('');
  const [sourceTableOpen, setSourceTableOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');

  const isExecutive = mode === 'executive';

  const handleAIGenerate = () => {
    setAiGenerated(true);
    setMetricName('Average Order Value');
    setSelectedMeasure('avg');
    setSelectedDimensions({
      time: 'Last 30 days',
      region: 'All Regions',
      product: 'All Products',
      customer: 'All Customers'
    });
    setSqlQuery(`SELECT 
  region,
  AVG(order_value) as avg_order_value,
  COUNT(*) as order_count
FROM analytics.orders
WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
  AND status = 'completed'
GROUP BY region
ORDER BY avg_order_value DESC`);
    toast.success('Metric generated by AI');
  };

  const handleSaveMetric = () => {
    toast.success('Metric added to your dashboard');
    onClose();
  };

  const handleTestQuery = () => {
    toast.success('Query executed successfully - 4 rows returned');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose} title="Create New Metric">
        <DialogContent style={{ maxWidth: '896px', maxHeight: '90vh', overflowY: 'auto' }}>
            <DialogDescription>
              {isExecutive 
                ? 'Use AI to quickly create a metric tailored to your needs'
                : 'Build a custom metric using AI or manual configuration'}
            </DialogDescription>

          <ContentWrapper>
            {!isExecutive && (
              <ModeSelector>
                <Button
                  variant={creationMode === 'ai' ? 'default' : 'ghost'}
                  style={{ flex: 1 }}
                  onClick={() => setCreationMode('ai')}
                >
                  <Sparkles style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                  AI Assistant
                </Button>
                <Button
                  variant={creationMode === 'manual' ? 'default' : 'ghost'}
                  style={{ flex: 1 }}
                  onClick={() => setCreationMode('manual')}
                >
                  <Edit3 style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                  Build from Scratch
                </Button>
              </ModeSelector>
            )}

            {(isExecutive || creationMode === 'ai') && (
              <AISection>
                <div>
                  <Label>Describe the metric you want to track</Label>
                  <InputRow>
                    <Input
                      placeholder="e.g., I want to track average order value by region"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <Button onClick={handleAIGenerate} disabled={!aiPrompt}>
                      <Sparkles style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                      Generate
                    </Button>
                  </InputRow>
                </div>

                {aiGenerated && (
                  <Card style={{ padding: '16px', borderColor: colors.purple200, backgroundColor: 'rgba(250, 245, 255, 0.3)' }}>
                    <AICardHeader>
                      <Sparkles style={{ height: '16px', width: '16px', color: colors.purple600, marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <AICardTitle>AI Generated Metric</AICardTitle>
                        <AICardDesc>
                          Based on your description, I've created this metric configuration
                        </AICardDesc>
                      </div>
                    </AICardHeader>

                    <ConfigSection>
                      <div>
                        <Label style={{ fontSize: '12px' }}>Metric Name</Label>
                        <Input
                          value={metricName}
                          onChange={(e) => setMetricName(e.target.value)}
                          style={{ marginTop: '4px' }}
                        />
                      </div>

                      <TwoColGrid>
                        <div style={{ marginTop: '4px' }}>
                          <Select
                            label="Measure"
                            value={selectedMeasure}
                            onChange={(v) => setSelectedMeasure(v)}
                            options={measures.map(m => ({ name: m.name, value: m.id }))}
                          />
                        </div>

                        <div style={{ marginTop: '4px' }}>
                          <Select
                            label="Time Period"
                            value={selectedDimensions.time}
                            onChange={(val) => setSelectedDimensions({ ...selectedDimensions, time: val })}
                            options={dimensions[0].options.map(opt => ({ name: opt, value: opt }))}
                          />
                        </div>
                      </TwoColGrid>

                      {!isExecutive && (
                        <TwoColGrid>
                          <div style={{ marginTop: '4px' }}>
                            <Select
                              label="Group by Region"
                              value={selectedDimensions.region}
                              onChange={(val) => setSelectedDimensions({ ...selectedDimensions, region: val })}
                              options={dimensions[1].options.map(opt => ({ name: opt, value: opt }))}
                            />
                          </div>

                          <div style={{ marginTop: '4px' }}>
                            <Select
                              label="Customer Segment"
                              value={selectedDimensions.customer}
                              onChange={(val) => setSelectedDimensions({ ...selectedDimensions, customer: val })}
                              options={dimensions[3].options.map(opt => ({ name: opt, value: opt }))}
                            />
                          </div>
                        </TwoColGrid>
                      )}
                    </ConfigSection>

                    <PreviewBox>
                      <PreviewHeader>
                        <Eye style={{ height: '12px', width: '12px' }} />
                        Preview
                      </PreviewHeader>
                      <PreviewRows>
                        {previewData.map((row, i) => (
                          <PreviewRow key={i}>
                            <MutedText>{row.region}</MutedText>
                            <PreviewValue>
                              <span style={{ fontWeight: 500 }}>{row.value}</span>
                              <Badge variant="secondary" style={{ fontSize: '12px' }}>{row.change}</Badge>
                            </PreviewValue>
                          </PreviewRow>
                        ))}
                      </PreviewRows>
                    </PreviewBox>

                    <QueryLink onClick={() => setActiveTab('query')}>
                      <Code style={{ height: '12px', width: '12px' }} />
                      {isExecutive ? 'View query logic' : 'View & edit query'}
                      <ChevronRight style={{ height: '12px', width: '12px' }} />
                    </QueryLink>
                  </Card>
                )}
              </AISection>
            )}

            {!isExecutive && creationMode === 'manual' && (
              <Tabs value={activeTab} onValueChange={setActiveTab} style={{ width: '100%' }}>
                <TabsList style={{ display: 'grid', width: '100%', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <TabsTrigger value="builder">
                    <Edit3 style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                    Visual Builder
                  </TabsTrigger>
                  <TabsTrigger value="query">
                    <Code style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                    Query
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Table style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                    Preview Data
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="builder" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                  <div>
                    <Label>Metric Name</Label>
                    <Input
                      placeholder="e.g., Average Order Value"
                      value={metricName}
                      onChange={(e) => setMetricName(e.target.value)}
                      style={{ marginTop: '8px' }}
                    />
                  </div>

                  <div>
                    <Label>Select Measure</Label>
                    <MeasureGrid>
                      {measures.map(measure => (
                        <MeasureCard
                          key={measure.id}
                          $selected={selectedMeasure === measure.id}
                          onClick={() => setSelectedMeasure(measure.id)}
                        >
                          <MeasureHeader>
                            <div>
                              <MeasureName>{measure.name}</MeasureName>
                              <MeasureDesc>{measure.description}</MeasureDesc>
                            </div>
                            {selectedMeasure === measure.id && (
                              <Check style={{ height: '16px', width: '16px', color: colors.primary }} />
                            )}
                          </MeasureHeader>
                        </MeasureCard>
                      ))}
                    </MeasureGrid>
                  </div>

                  <div>
                    <Label>Select Dimensions</Label>
                    <DimensionGrid>
                      {dimensions.map(dim => (
                        <div key={dim.id} style={{ marginTop: '4px' }}>
                          <Select
                            label={dim.name}
                            value={selectedDimensions[dim.id as keyof typeof selectedDimensions]}
                            onChange={(val) => setSelectedDimensions({ ...selectedDimensions, [dim.id]: val })}
                            options={dim.options.map(opt => ({ name: opt, value: opt }))}
                          />
                        </div>
                      ))}
                    </DimensionGrid>
                  </div>

                  <div>
                    <Label>Data Source</Label>
                    <DataSourceRow>
                      <Select
                        label="Data Source"
                        isLabelHidden
                        value="analytics.orders"
                        onChange={() => {}}
                        options={[
                          { name: 'analytics.orders', value: 'analytics.orders' },
                          { name: 'analytics.customers', value: 'analytics.customers' },
                          { name: 'analytics.revenue', value: 'analytics.revenue' },
                        ]}
                      />
                      <Button variant="outline" onClick={() => setSourceTableOpen(true)}>
                        <Table style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                        Open Table
                      </Button>
                    </DataSourceRow>
                  </div>
                </TabsContent>

                <TabsContent value="query" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                  <QueryHeader>
                    <Label>SQL Query</Label>
                    <QueryActions>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQueryEditMode(!queryEditMode)}
                      >
                        {queryEditMode ? (
                          <>
                            <X style={{ height: '16px', width: '16px', marginRight: '4px' }} />
                            Cancel Edit
                          </>
                        ) : (
                          <>
                            <Edit3 style={{ height: '16px', width: '16px', marginRight: '4px' }} />
                            Edit Query
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleTestQuery}>
                        <Play style={{ height: '16px', width: '16px', marginRight: '4px' }} />
                        Test Query
                      </Button>
                    </QueryActions>
                  </QueryHeader>

                  {queryEditMode && (
                    <WarningBox>
                      <WarningContent>
                        <Badge variant="outline" style={{ backgroundColor: '#fef9c3', color: '#854d0e', marginTop: '2px' }}>
                          Warning
                        </Badge>
                        <WarningText>
                          Editing the query directly will disable the visual builder. Your changes will be preserved.
                        </WarningText>
                      </WarningContent>
                    </WarningBox>
                  )}

                  <Textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    readOnly={!queryEditMode}
                    style={{
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                      fontSize: '12px',
                      height: '256px',
                      backgroundColor: queryEditMode ? undefined : colors.muted,
                    }}
                  />

                  {!queryEditMode && (
                    <ValidationRow>
                      <Check style={{ height: '12px', width: '12px', color: colors.green600 }} />
                      Query validated successfully
                    </ValidationRow>
                  )}
                </TabsContent>

                <TabsContent value="preview" style={{ marginTop: '16px' }}>
                  <PreviewTableWrap>
                    <PreviewTableHeader>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>Sample Results (4 rows)</div>
                    </PreviewTableHeader>
                    <PreviewTableScroll>
                      <StyledTable>
                        <thead style={{ backgroundColor: 'rgba(236, 236, 240, 0.5)' }}>
                          <tr>
                            <StyledTh>Region</StyledTh>
                            <StyledTh $align="right">Avg Order Value</StyledTh>
                            <StyledTh $align="right">Order Count</StyledTh>
                            <StyledTh $align="right">Change</StyledTh>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, i) => (
                            <StyledTr key={i}>
                              <StyledTd>{row.region}</StyledTd>
                              <StyledTd $align="right" style={{ fontWeight: 500 }}>{row.value}</StyledTd>
                              <StyledTd $align="right" style={{ color: colors.mutedForeground }}>1,234</StyledTd>
                              <StyledTd $align="right">
                                <Badge variant="secondary">{row.change}</Badge>
                              </StyledTd>
                            </StyledTr>
                          ))}
                        </tbody>
                      </StyledTable>
                    </PreviewTableScroll>
                  </PreviewTableWrap>

                  <Button
                    variant="outline"
                    style={{ marginTop: '16px', width: '100%' }}
                    onClick={() => setSourceTableOpen(true)}
                  >
                    <Table style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                    Open Full Source Table
                  </Button>
                </TabsContent>
              </Tabs>
            )}

            {isExecutive && activeTab === 'query' && aiGenerated && (
              <ExecQueryCard>
                <ExecQueryHeader>
                  <Label style={{ fontSize: '14px' }}>Query Logic</Label>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('builder')}>
                    <X style={{ height: '16px', width: '16px' }} />
                  </Button>
                </ExecQueryHeader>
                <ExecQueryPre>
                  {sqlQuery}
                </ExecQueryPre>
                <ExecQueryFooter>
                  <ValidationRow>
                    <Check style={{ height: '12px', width: '12px', color: colors.green600 }} />
                    Query looks correct
                  </ValidationRow>
                  <Button variant="link" size="sm" style={{ fontSize: '12px' }}>
                    Request changes
                  </Button>
                </ExecQueryFooter>
              </ExecQueryCard>
            )}
          </ContentWrapper>

          <FooterActions>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <FooterRight>
              {!isExecutive && (
                <Button variant="outline" onClick={() => setSourceTableOpen(true)}>
                  <Table style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                  View Source
                </Button>
              )}
              <Button onClick={handleSaveMetric} disabled={!aiGenerated && !metricName}>
                <Save style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Add to Dashboard
              </Button>
            </FooterRight>
          </FooterActions>
        </DialogContent>
      </Dialog>

      <SourceTableModal
        open={sourceTableOpen}
        onClose={() => setSourceTableOpen(false)}
      />
    </>
  );
}
