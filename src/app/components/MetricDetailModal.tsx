import styled from 'styled-components';
import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Users,
  Calendar,
  ExternalLink,
  Bell
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Theme } from '@doordash/prism-react';
import { colors } from '@/styles/theme';

interface Metric {
  id: string;
  category: string;
  name: string;
  description: string;
  current: string;
  prior: string;
  change: number;
  changeLabel: string;
  vsPlan?: string;
  vsPlanValue?: number;
  trend: number[];
  status: 'healthy' | 'warning' | 'critical' | 'excellent';
  aiInsight: {
    summary: string;
    confidence: number;
    details?: string;
  };
}

interface MetricDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metric: Metric;
}

const getDetailedAnalysis = (_metricId: string) => {
  return {
    what: {
      title: 'What Happened',
      description: 'Order frequency jumped to 4.1 orders per user over last 28 days, up from 3.88 last week (+5.5%). This is the highest frequency we\'ve seen in Q1 2026 and significantly above our target of 4.0.',
      assessment: 'This is a VERY POSITIVE signal - indicates strong user engagement.'
    },
    why: {
      title: 'Why It Moved (Root Cause Analysis)',
      primaryDrivers: [
        {
          name: 'Retention campaigns launched Jan 28',
          contribution: 42,
          details: [
            'Email "We miss you" campaign: 22% CTR (vs 12% baseline)',
            'Push notification re-engagement: 18% CTR (vs 9% baseline)',
            'Targeted $5 off coupons: 35% redemption rate',
            'These campaigns brought back 285K dormant users who placed an average of 2.1 orders since reactivation'
          ]
        },
        {
          name: 'DashPass subscriber behavior',
          contribution: 30,
          details: [
            'DashPass subs now at 4.8 orders/user (vs 4.3 last week)',
            'Non-subscribers: 3.2 orders/user (vs 3.1 last week)',
            'DashPass penetration grew 2 percentage points to 36%',
            'Higher-frequency users converting to DashPass at increased rate'
          ]
        }
      ],
      secondaryFactors: [
        {
          name: 'SuperBowl Sunday spike (Feb 11)',
          contribution: 20,
          details: [
            '15% order surge on that single day',
            'Many users placed multiple orders (party supplies + late snacks)',
            'This inflated the L28D rolling average'
          ]
        },
        {
          name: 'Weather effects (mixed)',
          contribution: 8,
          details: [
            'Good weather in West/South: Slight uptick in casual orders',
            'Bad weather in Northeast: Actually increased frequency among existing users (stay-home behavior)'
          ]
        }
      ]
    },
    who: {
      title: 'Who Drove It (User Segment Breakdown)',
      byUserType: [
        { segment: 'Existing high-frequency users (3+ orders/week)', change: 8.2, impact: 'Ordering even MORE frequently' },
        { segment: 'Medium-frequency users (1-2/week)', change: 6.8, impact: 'Moving up the frequency ladder' },
        { segment: 'Low-frequency users (<1/week)', change: 2.1, impact: 'Retention campaigns pulling some back' },
        { segment: 'Reactivated dormant users', change: null, impact: '+285K users reactivated' }
      ],
      byGeography: [
        { region: 'West Coast metros', change: 7.8, note: 'LA launch + good weather' },
        { region: 'South', change: 6.9, note: 'Strong SuperBowl engagement' },
        { region: 'Midwest', change: 5.2, note: 'Baseline growth' },
        { region: 'Northeast', change: 4.1, note: 'Weather suppressed but frequency held up' }
      ],
      byProduct: [
        { product: 'Restaurant orders', share: 82, note: 'Primary driver' },
        { product: 'Grocery add-on orders', share: 18, note: 'Users adding grocery to restaurant orders in same week' }
      ]
    },
    forecast: {
      title: 'Forecast & Trend',
      expected: 'Likely to settle at 4.0-4.05 next week as SuperBowl spike normalizes from the L28D rolling window',
      retentionImpact: 'Should persist for 2-3 more weeks',
      riskFactors: 'If reactivated users don\'t place 2nd order within 14 days, frequency could dip slightly in late Feb',
      confidence: 68,
      confidenceNote: 'SuperBowl anomaly makes forecasting fuzzy'
    },
    implications: {
      title: 'What This Means for the Business',
      positive: [
        'User engagement is increasing (core health metric)',
        'Retention tactics are working (validate continued investment)',
        'DashPass is delivering on promise (higher subscriber frequency)'
      ],
      however: [
        'SuperBowl created a temporary spike (don\'t over-index on this week)',
        'Need to convert reactivated users to sustained habit (2nd order within 14 days is critical)'
      ]
    },
    actions: [
      {
        priority: 'IMMEDIATE',
        title: 'Follow-up retention campaign',
        description: 'Target the 285K reactivated users with "Complete your 2nd order" incentive within 7 days. Boost 2nd order rate from 45% to 60%.',
        owner: 'Growth/Marketing',
        timeline: 'Launch by Feb 11'
      },
      {
        priority: 'THIS WEEK',
        title: 'Scale retention campaign playbook',
        description: 'High email CTR (22%) and push CTR (18%) suggest winning formula. Expand to broader dormant user base (1.2M users inactive 30+ days)',
        owner: 'CRM Team',
        timeline: 'Plan by Feb 15'
      },
      {
        priority: 'STRATEGIC',
        title: 'DashPass conversion focus',
        description: 'Gap between DashPass (4.8 freq) and non-DP (3.2 freq) is widening. Target users with 3+ orders in last 28 days who aren\'t DashPass yet (est. 2.1M)',
        owner: 'Product/Growth',
        timeline: 'Pilot test in 3 markets by Feb 20'
      },
      {
        priority: 'EXPERIMENT',
        title: 'Leverage SuperBowl learnings',
        description: 'Multi-order behavior on Feb 11 suggests "party mode" opportunity. Test for NBA All-Star (Feb 18), March Madness',
        owner: 'Product/Marketing',
        timeline: 'Ready for Feb 18'
      }
    ],
    relatedMetrics: [
      '2nd order rate for reactivated users (track daily)',
      'DashPass conversion rate (should uptick if action #3 executes)',
      'Retention rate (L28D, should improve if frequency sustains)',
      'CAC efficiency (if retention working, CAC impact should improve)'
    ]
  };
};

const timeSeriesData = [
  { date: 'Dec 15', value: 3.55, label: '3.55' },
  { date: 'Dec 22', value: 3.58, label: '3.58' },
  { date: 'Dec 29', value: 3.62, label: '3.62' },
  { date: 'Jan 5', value: 3.65, label: '3.65' },
  { date: 'Jan 12', value: 3.68, label: '3.68' },
  { date: 'Jan 19', value: 3.60, label: '3.60' },
  { date: 'Jan 26', value: 3.70, label: '3.70' },
  { date: 'Feb 2', value: 3.88, label: '3.88' },
  { date: 'Feb 9', value: 4.10, label: '4.10' }
];

const segmentData = [
  { segment: 'High-freq users', value: 8.2, color: '#3b82f6' },
  { segment: 'Med-freq users', value: 6.8, color: '#8b5cf6' },
  { segment: 'Low-freq users', value: 2.1, color: '#ec4899' }
];

const geographyData = [
  { region: 'West Coast', value: 7.8, color: '#10b981' },
  { region: 'South', value: 6.9, color: '#3b82f6' },
  { region: 'Midwest', value: 5.2, color: '#f59e0b' },
  { region: 'Northeast', value: 4.1, color: '#ef4444' }
];

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const MetricValue = styled.div`
  text-align: right;
`;

const CurrentValue = styled.div`
  font-size: ${Theme.usage.fontSize.xxLarge};
  font-weight: 700;
`;

const ChangeLabel = styled.div<{ $positive: boolean }>`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${({ $positive }) => $positive ? colors.green600 : colors.red600};
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  margin-top: ${Theme.usage.space.small};
`;

const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const CardPadded = styled(Card)`
  padding: ${Theme.usage.space.medium};
`;

const SectionTitle = styled.h3`
  font-weight: 600;
  margin-bottom: ${Theme.usage.space.xSmall};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const SectionTitle3 = styled.h3`
  font-weight: 600;
  margin-bottom: ${Theme.usage.space.small};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const DescText = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const AssessmentText = styled.div<{ $positive: boolean }>`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${({ $positive }) => $positive ? colors.green600 : colors.foreground};
`;

const DriverBlock = styled.div<{ $borderColor?: string }>`
  margin-bottom: ${Theme.usage.space.small};
  padding-left: ${Theme.usage.space.medium};
  border-left: 2px solid ${({ $borderColor }) => $borderColor || colors.border};
`;

const DriverHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const DriverName = styled.span`
  font-weight: 500;
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const DetailList = styled.ul`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SubSectionLabel = styled.div`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const SpacedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
`;

const SegmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const SegmentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const MutedText = styled.span`
  color: ${colors.mutedForeground};
`;

const GreenText = styled.span`
  color: ${colors.green600};
  font-weight: 500;
`;

const SmallMuted = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const GeoLabel = styled.span`
  color: ${colors.mutedForeground};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const ForecastText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const ForecastBadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding-top: ${Theme.usage.space.xSmall};
`;

const ImplicationList = styled.ul`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ImplicationSub = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`;

const GreenLabel = styled.div`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: #15803d;
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const YellowLabel = styled.div`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: #a16207;
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const RelatedList = styled.ul`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RelatedItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const ChartTitle = styled.h3`
  font-weight: 600;
  margin-bottom: ${Theme.usage.space.medium};
`;

const ActionCardStyled = styled(Card)<{ $priority: string }>`
  padding: ${Theme.usage.space.medium};
  border-color: ${({ $priority }) =>
    $priority === 'IMMEDIATE' ? '#fecdd3' :
    $priority === 'THIS WEEK' ? '#fef08a' :
    $priority === 'STRATEGIC' ? '#bfdbfe' :
    colors.purple200};
  background-color: ${({ $priority }) =>
    $priority === 'IMMEDIATE' ? 'rgba(254, 205, 211, 0.3)' :
    $priority === 'THIS WEEK' ? 'rgba(254, 240, 138, 0.3)' :
    $priority === 'STRATEGIC' ? 'rgba(191, 219, 254, 0.3)' :
    'rgba(233, 213, 255, 0.3)'};
`;

const ActionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const ActionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const ActionTitle = styled.h4`
  font-weight: 600;
`;

const ActionDesc = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.small};
`;

const ActionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.medium};
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xSmall};
  padding-top: ${Theme.usage.space.medium};
`;

const TabsContentStyled = styled(TabsContent)`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
  margin-top: ${Theme.usage.space.medium};
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`;

const getPriorityBadgeStyle = (priority: string) => {
  switch (priority) {
    case 'IMMEDIATE': return { backgroundColor: '#fee2e2', color: '#b91c1c', borderColor: '#fecdd3' };
    case 'THIS WEEK': return { backgroundColor: '#fef9c3', color: '#a16207', borderColor: '#fef08a' };
    case 'STRATEGIC': return { backgroundColor: '#dbeafe', color: '#1d4ed8', borderColor: '#bfdbfe' };
    default: return { backgroundColor: colors.purple100, color: colors.purple700, borderColor: colors.purple200 };
  }
};

export function MetricDetailModal({ open, onOpenChange, metric }: MetricDetailModalProps) {
  const analysis = getDetailedAnalysis(metric.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={`AI Analysis: ${metric.name}`}>
      <DialogContent style={{ maxWidth: '1152px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <HeaderRow>
            <div>
              <DialogDescription style={{ marginTop: '8px' }}>
                {metric.description}
              </DialogDescription>
            </div>
            <MetricValue>
              <CurrentValue>{metric.current}</CurrentValue>
              <ChangeLabel $positive={metric.change > 0}>
                {metric.changeLabel} vs prior
              </ChangeLabel>
            </MetricValue>
          </HeaderRow>
          <BadgeRow>
            <Badge style={{ backgroundColor: colors.purple100, color: colors.purple700, borderColor: colors.purple200 }}>
              Confidence: {metric.aiInsight.confidence}%
            </Badge>
            <Badge style={{ backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }}>
              Last updated: 5 mins ago
            </Badge>
            {metric.status === 'excellent' && (
              <Badge style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
                <CheckCircle2 style={{ height: '12px', width: '12px', marginRight: '4px' }} />
                Excellent Performance
              </Badge>
            )}
            {metric.status === 'warning' && (
              <Badge style={{ backgroundColor: '#fef9c3', color: '#a16207', borderColor: '#fef08a' }}>
                <AlertCircle style={{ height: '12px', width: '12px', marginRight: '4px' }} />
                Needs Attention
              </Badge>
            )}
          </BadgeRow>

        <ScrollContent>
          <Tabs defaultValue="analysis" style={{ width: '100%' }}>
            <TabsList style={{ display: 'grid', width: '100%', gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="charts">Charts & Trends</TabsTrigger>
              <TabsTrigger value="actions">Recommended Actions</TabsTrigger>
            </TabsList>

            <TabsContentStyled value="analysis">
              <CardPadded>
                <SectionTitle>
                  🎯 {analysis.what.title}
                </SectionTitle>
                <DescText>{analysis.what.description}</DescText>
                <AssessmentText $positive={analysis.what.assessment.includes('POSITIVE')}>
                  ✅ {analysis.what.assessment}
                </AssessmentText>
              </CardPadded>

              <CardPadded>
                <SectionTitle3>
                  📊 {analysis.why.title}
                </SectionTitle3>

                <div style={{ marginBottom: '16px' }}>
                  <SubSectionLabel>Primary Drivers (72% of the change):</SubSectionLabel>
                  {analysis.why.primaryDrivers.map((driver, idx) => (
                    <DriverBlock key={idx} $borderColor="#3b82f6">
                      <DriverHeader>
                        <DriverName>{idx + 1}. {driver.name}</DriverName>
                        <Badge variant="outline" style={{ fontSize: '12px' }}>{driver.contribution}% of lift</Badge>
                      </DriverHeader>
                      <DetailList>
                        {driver.details.map((detail, i) => (
                          <li key={i}>• {detail}</li>
                        ))}
                      </DetailList>
                    </DriverBlock>
                  ))}
                </div>

                <div>
                  <SubSectionLabel>Secondary Factors (28% of the change):</SubSectionLabel>
                  {analysis.why.secondaryFactors.map((factor, idx) => (
                    <DriverBlock key={idx}>
                      <DriverHeader>
                        <DriverName>{idx + 3}. {factor.name}</DriverName>
                        <Badge variant="outline" style={{ fontSize: '12px' }}>{factor.contribution}%</Badge>
                      </DriverHeader>
                      <DetailList>
                        {factor.details.map((detail, i) => (
                          <li key={i}>• {detail}</li>
                        ))}
                      </DetailList>
                    </DriverBlock>
                  ))}
                </div>
              </CardPadded>

              <CardPadded>
                <SectionTitle3>
                  👥 {analysis.who.title}
                </SectionTitle3>

                <SpacedSection>
                  <div>
                    <SubSectionLabel>By User Type:</SubSectionLabel>
                    <SegmentList>
                      {analysis.who.byUserType.map((item, idx) => (
                        <SegmentRow key={idx}>
                          <MutedText>{item.segment}</MutedText>
                          <FlexCenter>
                            {item.change !== null && (
                              <GreenText>+{item.change}%</GreenText>
                            )}
                            <SmallMuted>{item.impact}</SmallMuted>
                          </FlexCenter>
                        </SegmentRow>
                      ))}
                    </SegmentList>
                  </div>

                  <div>
                    <SubSectionLabel>By Geography:</SubSectionLabel>
                    <SegmentList>
                      {analysis.who.byGeography.map((item, idx) => (
                        <SegmentRow key={idx}>
                          <GeoLabel>
                            <MapPin style={{ height: '12px', width: '12px' }} />
                            {item.region}
                          </GeoLabel>
                          <FlexCenter>
                            <GreenText>+{item.change}%</GreenText>
                            <SmallMuted>({item.note})</SmallMuted>
                          </FlexCenter>
                        </SegmentRow>
                      ))}
                    </SegmentList>
                  </div>

                  <div>
                    <SubSectionLabel>By Product:</SubSectionLabel>
                    <SegmentList>
                      {analysis.who.byProduct.map((item, idx) => (
                        <SegmentRow key={idx}>
                          <MutedText>{item.product}</MutedText>
                          <FlexCenter>
                            <span style={{ fontWeight: 500 }}>{item.share}% of volume</span>
                            <SmallMuted>({item.note})</SmallMuted>
                          </FlexCenter>
                        </SegmentRow>
                      ))}
                    </SegmentList>
                  </div>
                </SpacedSection>
              </CardPadded>

              <CardPadded>
                <SectionTitle3>
                  🔮 {analysis.forecast.title}
                </SectionTitle3>
                <ForecastText>
                  <p><span style={{ fontWeight: 500 }}>Expected trajectory:</span> {analysis.forecast.expected}</p>
                  <p><span style={{ fontWeight: 500 }}>Retention campaign impact:</span> {analysis.forecast.retentionImpact}</p>
                  <p><span style={{ fontWeight: 500 }}>Risk factors:</span> {analysis.forecast.riskFactors}</p>
                  <ForecastBadgeRow>
                    <Badge style={{ backgroundColor: '#fef9c3', color: '#a16207', borderColor: '#fef08a' }}>
                      Confidence: {analysis.forecast.confidence}%
                    </Badge>
                    <SmallMuted>{analysis.forecast.confidenceNote}</SmallMuted>
                  </ForecastBadgeRow>
                </ForecastText>
              </CardPadded>

              <CardPadded>
                <SectionTitle3>
                  💡 {analysis.implications.title}
                </SectionTitle3>
                <ImplicationSub>
                  <div>
                    <GreenLabel>This is a strong positive signal:</GreenLabel>
                    <ImplicationList>
                      {analysis.implications.positive.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ImplicationList>
                  </div>
                  <div>
                    <YellowLabel>However:</YellowLabel>
                    <ImplicationList>
                      {analysis.implications.however.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ImplicationList>
                  </div>
                </ImplicationSub>
              </CardPadded>

              <CardPadded>
                <SectionTitle>
                  📎 Related Metrics to Watch
                </SectionTitle>
                <RelatedList>
                  {analysis.relatedMetrics.map((metricItem, idx) => (
                    <RelatedItem key={idx}>
                      <CheckCircle2 style={{ height: '12px', width: '12px' }} />
                      {metricItem}
                    </RelatedItem>
                  ))}
                </RelatedList>
              </CardPadded>
            </TabsContentStyled>

            <TabsContentStyled value="charts">
              <CardPadded>
                <ChartTitle>90-Day Trend</ChartTitle>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      label={{ fontSize: 10, position: 'top' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardPadded>

              <CardPadded>
                <ChartTitle>By User Segment</ChartTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={segmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} label={{ value: '% Change', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardPadded>

              <CardPadded>
                <ChartTitle>By Geography</ChartTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={geographyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} label={{ value: '% Change', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardPadded>
            </TabsContentStyled>

            <TabsContentStyled value="actions">
              <ActionsContainer>
                {analysis.actions.map((action, idx) => (
                  <ActionCardStyled key={idx} $priority={action.priority}>
                    <ActionHeader>
                      <ActionTitleRow>
                        <Badge style={getPriorityBadgeStyle(action.priority)}>
                          {action.priority}
                        </Badge>
                        <ActionTitle>{action.title}</ActionTitle>
                      </ActionTitleRow>
                    </ActionHeader>
                    <ActionDesc>{action.description}</ActionDesc>
                    <ActionMeta>
                      <MetaItem>
                        <Users style={{ height: '12px', width: '12px' }} />
                        <span>Owner: {action.owner}</span>
                      </MetaItem>
                      <MetaItem>
                        <Calendar style={{ height: '12px', width: '12px' }} />
                        <span>Timeline: {action.timeline}</span>
                      </MetaItem>
                    </ActionMeta>
                  </ActionCardStyled>
                ))}
              </ActionsContainer>

              <ButtonRow>
                <Button style={{ flex: 1 }}>
                  <ExternalLink style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                  View Source Dashboard
                </Button>
                <Button variant="outline" style={{ flex: 1 }}>
                  <Bell style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                  Set Alert if Drops Below 3.9
                </Button>
              </ButtonRow>
            </TabsContentStyled>
          </Tabs>
        </ScrollContent>
      </DialogContent>
    </Dialog>
  );
}
