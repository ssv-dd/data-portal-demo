import styled from 'styled-components';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, ArrowRight, TrendingUp, TrendingDown, Database, BarChart3, FileText, Brain } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';

interface AIOverviewSectionProps {
  query: string;
  onDiveDeeperClick: () => void;
}

const SectionWrapper = styled.div`
  margin-bottom: ${Theme.usage.space.xLarge};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.medium};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const IconBox = styled.div`
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${radius.xl};
  background: rgb(var(--app-primary-rgb) / 0.1);
`;

const AskAIBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.full};
  background: linear-gradient(to right, rgb(var(--app-purple-rgb) / 0.1), rgb(var(--app-blue-rgb) / 0.1), rgb(var(--app-indigo-rgb) / 0.1));
  border: 1px solid ${colors.purple200};
`;

const AskAIIconWrap = styled.div`
  position: relative;
`;

const AskAIGlow = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #a855f7, #3b82f6);
  border-radius: ${Theme.usage.borderRadius.small};
  filter: blur(4px);
  opacity: 0.5;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.3; }
  }
`;

const AskAIIconInner = styled.div`
  position: relative;
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.small};
  background: linear-gradient(to right, #a855f7, #3b82f6);
`;

const AskAIText = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  background: linear-gradient(to right, ${colors.purple600}, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MainCard = styled(Card)`
  padding: ${Theme.usage.space.large};
  background: linear-gradient(to bottom right, rgb(var(--app-primary-rgb) / 0.05), ${colors.background}, ${colors.background});
  border-color: rgb(var(--app-primary-rgb) / 0.2);
`;

const SummarySection = styled.div`
  margin-bottom: ${Theme.usage.space.large};
`;

const SummaryText = styled.p`
  font-size: ${Theme.usage.fontSize.small};
  line-height: 1.75;
  margin-bottom: ${Theme.usage.space.medium};
`;

const InsightBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${Theme.usage.space.small};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${Theme.usage.space.medium};
  margin-bottom: ${Theme.usage.space.large};

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ChartBox = styled.div`
  background-color: ${colors.card};
  padding: ${Theme.usage.space.medium};
  border-radius: ${radius.xl};
  border: 1px solid ${colors.border};
  min-height: 200px;
`;

const ChartTitle = styled.h4`
  margin-bottom: ${Theme.usage.space.small};
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 180px;
`;

const TraceabilityTrigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  transition: background-color 150ms;

  &:hover {
    background-color: ${colors.muted};
  }
`;

const TraceabilityLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const TraceabilityTitle = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
`;

const TraceabilityContent = styled(CollapsibleContent)`
  margin-top: ${Theme.usage.space.small};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
`;

const SourceCard = styled.div`
  padding: ${Theme.usage.space.medium};
  border-radius: ${radius.xl};
  background-color: ${colors.card};
  border: 1px solid ${colors.border};
`;

const SourceTitle = styled.h4`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  margin-bottom: ${Theme.usage.space.small};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const SourcesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const SourceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${radius.md};
  background-color: rgb(var(--app-muted-rgb) / 0.5);
`;

const SourceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const ConfidenceRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const ConfidenceBar = styled.div`
  width: 64px;
  height: 4px;
  background-color: ${colors.muted};
  border-radius: ${Theme.usage.borderRadius.full};
  overflow: hidden;
`;

const ConfidenceLabel = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  font-weight: 500;
`;

const ReasoningStep = styled(motion.div)`
  display: flex;
  gap: ${Theme.usage.space.small};
`;

const StepNumber = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: ${Theme.usage.borderRadius.full};
  background: linear-gradient(to right, #a855f7, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
`;

const StepText = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  line-height: 1.625;
  padding-top: ${Theme.usage.space.xxxSmall};
`;

export function AIOverviewSection({ query, onDiveDeeperClick }: AIOverviewSectionProps) {
  const getAIResponse = () => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('merchant') && (lowerQuery.includes('cancel') || lowerQuery.includes('churn'))) {
      return {
        summary: "Merchant cancellation rate has increased by 2.3% over the last month, primarily driven by three factors: (1) seasonal slowdown in the food delivery market affecting smaller merchants, (2) increased competition from new delivery platforms in tier-2 cities, and (3) pricing changes that impacted merchant profitability. The increase is concentrated in specific segments, with restaurants under $50K monthly revenue showing the highest churn rates.",
        keyInsights: [
          { label: 'Overall Increase', value: '+2.3%', trend: 'up' as const },
          { label: 'Highest Impact Segment', value: 'Small Restaurants', trend: 'neutral' as const },
          { label: 'Geographic Concentration', value: 'Tier-2 Cities', trend: 'neutral' as const }
        ],
        chartData: [
          { month: 'Jan', rate: 3.2 }, { month: 'Feb', rate: 3.4 }, { month: 'Mar', rate: 3.1 },
          { month: 'Apr', rate: 3.8 }, { month: 'May', rate: 4.2 }, { month: 'Jun', rate: 4.5 }
        ],
        segmentData: [
          { segment: 'Small (<$50K)', value: 6.8 }, { segment: 'Medium ($50-200K)', value: 3.2 }, { segment: 'Large (>$200K)', value: 1.4 }
        ],
        sources: [
          { name: 'merchant_events_table', type: 'table' as const, icon: Database, confidence: 95 },
          { name: 'Merchant Health Dashboard', type: 'dashboard' as const, icon: BarChart3, confidence: 92 },
          { name: 'Merchant Churn Analysis Report', type: 'report' as const, icon: FileText, confidence: 88 }
        ],
        reasoning: [
          'Analyzed 30-day trend from merchant_events_table showing 2.3% increase',
          'Cross-referenced geographic data revealing tier-2 city concentration',
          'Segmented by revenue size using merchant_profiles dimension table',
          'Correlated with pricing change timeline from product_changes_log'
        ]
      };
    } else if (lowerQuery.includes('revenue') && (lowerQuery.includes('grow') || lowerQuery.includes('increas') || lowerQuery.includes('trend'))) {
      return {
        summary: "Revenue is growing at a healthy 18.5% year-over-year, driven primarily by increased order frequency from DashPass members and geographic expansion into new markets. The growth is sustainable, with improving unit economics and strong retention metrics. Key markets like California and Texas are outperforming, while international markets show promising early traction.",
        keyInsights: [
          { label: 'YoY Growth', value: '+18.5%', trend: 'up' as const },
          { label: 'DashPass Contribution', value: '+42%', trend: 'up' as const },
          { label: 'New Market Revenue', value: '$12.3M', trend: 'up' as const }
        ],
        chartData: [
          { month: 'Jan', revenue: 4800 }, { month: 'Feb', revenue: 5200 }, { month: 'Mar', revenue: 6100 },
          { month: 'Apr', revenue: 5500 }, { month: 'May', revenue: 6800 }, { month: 'Jun', revenue: 7200 }
        ],
        segmentData: [
          { segment: 'DashPass', value: 4200 }, { segment: 'Regular Orders', value: 2100 }, { segment: 'New Markets', value: 900 }
        ],
        sources: [
          { name: 'revenue_daily_fact', type: 'table' as const, icon: Database, confidence: 98 },
          { name: 'Revenue Analytics Dashboard', type: 'dashboard' as const, icon: BarChart3, confidence: 94 },
          { name: 'dashpass_metrics_table', type: 'table' as const, icon: Database, confidence: 91 }
        ],
        reasoning: [
          'Calculated YoY growth from revenue_daily_fact aggregated by month',
          'Isolated DashPass contribution using subscription_revenue segment',
          'Identified new market performance from geo_expansion_metrics',
          'Validated unit economics improvement from cost_per_order trend'
        ]
      };
    } else if (lowerQuery.includes('customer') && lowerQuery.includes('retention')) {
      return {
        summary: "Customer retention has improved significantly, reaching 78.2% (up 8.2% from last quarter). The improvement is attributed to the new DashPass premium tier launch, enhanced personalization in the app, and improved delivery experience. First-time user retention increased by 12%, indicating strong product-market fit improvements.",
        keyInsights: [
          { label: 'Overall Retention', value: '78.2%', trend: 'up' as const },
          { label: 'Quarter over Quarter', value: '+8.2%', trend: 'up' as const },
          { label: 'First-time Users', value: '+12%', trend: 'up' as const }
        ],
        chartData: [
          { month: 'Jan', rate: 70 }, { month: 'Feb', rate: 72 }, { month: 'Mar', rate: 74 },
          { month: 'Apr', rate: 75 }, { month: 'May', rate: 76 }, { month: 'Jun', rate: 78 }
        ],
        segmentData: [
          { segment: 'DashPass', value: 92 }, { segment: 'Premium', value: 88 }, { segment: 'Standard', value: 65 }
        ],
        sources: [
          { name: 'customer_cohort_analysis', type: 'table' as const, icon: Database, confidence: 96 },
          { name: 'Customer Insights Dashboard', type: 'dashboard' as const, icon: BarChart3, confidence: 93 },
          { name: 'user_retention_metrics', type: 'table' as const, icon: Database, confidence: 90 }
        ],
        reasoning: [
          'Computed retention rate from customer_cohort_analysis using 90-day window',
          'Segmented by subscription tier to identify DashPass premium impact',
          'Analyzed first-time user cohorts from user_acquisition_events',
          'Correlated retention improvement with app_feature_releases timeline'
        ]
      };
    } else {
      return {
        summary: "Order volume has grown by 15% month-over-month, with particularly strong performance during dinner hours and weekends. The BOGO campaign in Canada drove significant incremental orders, while the new ghost kitchen partnerships expanded selection in key markets. Mobile app orders continue to dominate, representing 87% of total volume.",
        keyInsights: [
          { label: 'MoM Growth', value: '+15%', trend: 'up' as const },
          { label: 'Peak Hour Performance', value: '+23%', trend: 'up' as const },
          { label: 'Mobile Share', value: '87%', trend: 'up' as const }
        ],
        chartData: [
          { month: 'Jan', orders: 24000 }, { month: 'Feb', orders: 28000 }, { month: 'Mar', orders: 32000 },
          { month: 'Apr', orders: 29000 }, { month: 'May', orders: 35000 }, { month: 'Jun', orders: 38000 }
        ],
        segmentData: [
          { segment: 'Dinner', value: 18500 }, { segment: 'Lunch', value: 12300 }, { segment: 'Late Night', value: 7200 }
        ],
        sources: [
          { name: 'orders_fact_table', type: 'table' as const, icon: Database, confidence: 97 },
          { name: 'Order Analytics Dashboard', type: 'dashboard' as const, icon: BarChart3, confidence: 94 },
          { name: 'campaign_performance_metrics', type: 'table' as const, icon: Database, confidence: 89 }
        ],
        reasoning: [
          'Aggregated order counts from orders_fact_table by month',
          'Segmented by hour_of_day dimension to identify peak performance',
          'Isolated campaign impact using promo_code attribution',
          'Calculated mobile share from platform_type breakdown'
        ]
      };
    }
  };

  const response = getAIResponse();
  const chartDataKey = 'rate' in response.chartData[0] ? 'rate' : 'revenue' in response.chartData[0] ? 'revenue' : 'orders';

  return (
    <SectionWrapper>
      <HeaderRow>
        <HeaderLeft>
          <IconBox>
            <Sparkles style={{ height: '20px', width: '20px', color: colors.primary }} />
          </IconBox>
          <h2>AI Overview</h2>
        </HeaderLeft>
        
        <AskAIBadge>
          <AskAIIconWrap>
            <AskAIGlow />
            <AskAIIconInner>
              <Brain style={{ height: '12px', width: '12px', color: colors.white }} />
            </AskAIIconInner>
          </AskAIIconWrap>
          <AskAIText>Powered by AskAI</AskAIText>
        </AskAIBadge>
      </HeaderRow>

      <MainCard>
        <SummarySection>
          <SummaryText>{response.summary}</SummaryText>
          
          <InsightBadges>
            {response.keyInsights.map((insight, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ fontSize: '12px', color: colors.mutedForeground }}>{insight.label}:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {insight.value}
                  {(insight.trend as string) === 'up' && <TrendingUp style={{ height: '12px', width: '12px', color: colors.green600 }} />}
                  {(insight.trend as string) === 'down' && <TrendingDown style={{ height: '12px', width: '12px', color: colors.red600 }} />}
                </span>
              </Badge>
            ))}
          </InsightBadges>
        </SummarySection>

        <ChartsGrid>
          <ChartBox>
            <ChartTitle>Trend Over Time</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                <LineChart data={response.chartData as { month: string; [key: string]: string | number }[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.muted} />
                  <XAxis dataKey="month" tick={{ fill: colors.mutedForeground, fontSize: 12 }} />
                  <YAxis tick={{ fill: colors.mutedForeground, fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: '8px' }} />
                  <Line type="monotone" dataKey={chartDataKey} stroke={colors.primary} strokeWidth={2} dot={{ fill: colors.primary, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartBox>

          <ChartBox>
            <ChartTitle>Breakdown by Segment</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                <BarChart data={response.segmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.muted} />
                  <XAxis dataKey="segment" tick={{ fill: colors.mutedForeground, fontSize: 12 }} angle={-15} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: colors.mutedForeground, fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartBox>
        </ChartsGrid>

        <Collapsible style={{ marginBottom: '24px' }}>
          <CollapsibleTrigger style={{ width: '100%' }}>
            <TraceabilityTrigger>
              <TraceabilityLabel>
                <Brain style={{ height: '16px', width: '16px', color: colors.purple600 }} />
                <TraceabilityTitle>View AI reasoning and sources</TraceabilityTitle>
              </TraceabilityLabel>
              <Badge variant="outline" style={{ fontSize: '12px' }}>
                {response.sources.length} sources
              </Badge>
            </TraceabilityTrigger>
          </CollapsibleTrigger>
          
          <TraceabilityContent>
            <SourceCard>
              <SourceTitle>
                <Database style={{ height: '16px', width: '16px', color: '#2563eb' }} />
                Data Sources
              </SourceTitle>
              <SourcesList>
                {response.sources.map((source, index) => (
                  <SourceRow key={index}>
                    <SourceInfo>
                      <source.icon style={{ height: '16px', width: '16px', color: colors.mutedForeground }} />
                      <span style={{ fontSize: '14px' }}>{source.name}</span>
                      <Badge variant="secondary" style={{ fontSize: '12px', textTransform: 'capitalize' }}>{source.type}</Badge>
                    </SourceInfo>
                    <ConfidenceRow>
                      <ConfidenceBar>
                        <motion.div
                          style={{ height: '100%', background: 'linear-gradient(to right, #22c55e, #10b981)' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${source.confidence}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </ConfidenceBar>
                      <ConfidenceLabel>{source.confidence}%</ConfidenceLabel>
                    </ConfidenceRow>
                  </SourceRow>
                ))}
              </SourcesList>
            </SourceCard>

            <SourceCard>
              <SourceTitle>
                <Sparkles style={{ height: '16px', width: '16px', color: colors.purple600 }} />
                AI Reasoning Steps
              </SourceTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {response.reasoning.map((step, index) => (
                  <ReasoningStep
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <StepNumber>{index + 1}</StepNumber>
                    <StepText>{step}</StepText>
                  </ReasoningStep>
                ))}
              </div>
            </SourceCard>
          </TraceabilityContent>
        </Collapsible>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            onClick={onDiveDeeperClick}
            size="lg"
            style={{
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(to right, #9333ea, #db2777, #2563eb)',
              border: 0,
              boxShadow: '0 10px 15px -3px rgb(var(--app-overlay-rgb) / 0.1)',
              transition: 'all 300ms',
            }}
          >
            <motion.div
              style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgb(var(--app-surface-rgb) / 0.3), transparent)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            />
            
            <motion.div 
              style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles style={{ height: '20px', width: '20px' }} />
              </motion.div>
              <span style={{ fontWeight: 600 }}>Dive Deeper in AI Mode</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight style={{ height: '20px', width: '20px' }} />
              </motion.div>
            </motion.div>
          </Button>
        </motion.div>
      </MainCard>
    </SectionWrapper>
  );
}
