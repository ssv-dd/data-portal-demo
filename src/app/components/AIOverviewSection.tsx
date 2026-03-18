import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, ArrowRight, TrendingUp, TrendingDown, Database, BarChart3, FileText, Brain } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface AIOverviewSectionProps {
  query: string;
  onDiveDeeperClick: () => void;
}

export function AIOverviewSection({ query, onDiveDeeperClick }: AIOverviewSectionProps) {
  // Generate context-aware response based on query
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
          { month: 'Jan', rate: 3.2 },
          { month: 'Feb', rate: 3.4 },
          { month: 'Mar', rate: 3.1 },
          { month: 'Apr', rate: 3.8 },
          { month: 'May', rate: 4.2 },
          { month: 'Jun', rate: 4.5 }
        ],
        segmentData: [
          { segment: 'Small (<$50K)', value: 6.8 },
          { segment: 'Medium ($50-200K)', value: 3.2 },
          { segment: 'Large (>$200K)', value: 1.4 }
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
          { month: 'Jan', revenue: 4800 },
          { month: 'Feb', revenue: 5200 },
          { month: 'Mar', revenue: 6100 },
          { month: 'Apr', revenue: 5500 },
          { month: 'May', revenue: 6800 },
          { month: 'Jun', revenue: 7200 }
        ],
        segmentData: [
          { segment: 'DashPass', value: 4200 },
          { segment: 'Regular Orders', value: 2100 },
          { segment: 'New Markets', value: 900 }
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
          { month: 'Jan', rate: 70 },
          { month: 'Feb', rate: 72 },
          { month: 'Mar', rate: 74 },
          { month: 'Apr', rate: 75 },
          { month: 'May', rate: 76 },
          { month: 'Jun', rate: 78 }
        ],
        segmentData: [
          { segment: 'DashPass', value: 92 },
          { segment: 'Premium', value: 88 },
          { segment: 'Standard', value: 65 }
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
      // Default response for order-related queries
      return {
        summary: "Order volume has grown by 15% month-over-month, with particularly strong performance during dinner hours and weekends. The BOGO campaign in Canada drove significant incremental orders, while the new ghost kitchen partnerships expanded selection in key markets. Mobile app orders continue to dominate, representing 87% of total volume.",
        keyInsights: [
          { label: 'MoM Growth', value: '+15%', trend: 'up' as const },
          { label: 'Peak Hour Performance', value: '+23%', trend: 'up' as const },
          { label: 'Mobile Share', value: '87%', trend: 'up' as const }
        ],
        chartData: [
          { month: 'Jan', orders: 24000 },
          { month: 'Feb', orders: 28000 },
          { month: 'Mar', orders: 32000 },
          { month: 'Apr', orders: 29000 },
          { month: 'May', orders: 35000 },
          { month: 'Jun', orders: 38000 }
        ],
        segmentData: [
          { segment: 'Dinner', value: 18500 },
          { segment: 'Lunch', value: 12300 },
          { segment: 'Late Night', value: 7200 }
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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h2>AI Overview</h2>
        </div>
        
        {/* Powered by AskAI Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 border border-purple-200 dark:border-purple-800">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md blur-sm opacity-50 animate-pulse"></div>
            <div className="relative p-1 rounded-md bg-gradient-to-r from-purple-500 to-blue-500">
              <Brain className="h-3 w-3 text-white" />
            </div>
          </div>
          <span className="text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Powered by AskAI
          </span>
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-background border-primary/20">
        {/* AI Summary */}
        <div className="mb-6">
          <p className="text-base leading-relaxed mb-4">
            {response.summary}
          </p>
          
          {/* Key Insights Badges */}
          <div className="flex flex-wrap gap-3">
            {response.keyInsights.map((insight, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="px-3 py-1.5 flex items-center gap-2"
              >
                <span className="text-xs text-muted-foreground">{insight.label}:</span>
                <span className="flex items-center gap-1">
                  {insight.value}
                  {(insight.trend as string) === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                  {(insight.trend as string) === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                </span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Trend Chart */}
          <div className="bg-card p-4 rounded-lg border" style={{ minHeight: '200px' }}>
            <h4 className="mb-3 text-sm text-muted-foreground">Trend Over Time</h4>
            <div className="w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                <LineChart data={response.chartData as { month: string; [key: string]: string | number }[]}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={chartDataKey}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Segment Breakdown Chart */}
          <div className="bg-card p-4 rounded-lg border" style={{ minHeight: '200px' }}>
            <h4 className="mb-3 text-sm text-muted-foreground">Breakdown by Segment</h4>
            <div className="w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                <BarChart data={response.segmentData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="segment" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Traceability Section */}
        <Collapsible className="mb-6">
          <CollapsibleTrigger className="w-full group">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium">View AI reasoning and sources</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {response.sources.length} sources
              </Badge>
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3 space-y-4">
            {/* Data Sources */}
            <div className="p-4 rounded-lg bg-card border">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Data Sources
              </h4>
              <div className="space-y-2">
                {response.sources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center gap-2">
                      <source.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{source.name}</span>
                      <Badge variant="secondary" className="text-xs capitalize">{source.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${source.confidence}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{source.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reasoning Steps */}
            <div className="p-4 rounded-lg bg-card border">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                AI Reasoning Steps
              </h4>
              <div className="space-y-2">
                {response.reasoning.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Dive Deeper CTA with Animated Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            onClick={onDiveDeeperClick}
            size="lg"
            className="w-full relative overflow-hidden group bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Animated Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut"
              }}
            />
            
            {/* Button Content */}
            <motion.div 
              className="relative flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
              <span className="font-semibold">Dive Deeper in AI Mode</span>
              <motion.div
                animate={{ 
                  x: [0, 4, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </motion.div>
          </Button>
        </motion.div>
      </Card>
    </div>
  );
}