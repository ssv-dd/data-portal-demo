import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Users,
  Calendar,
  ExternalLink,
  Bell
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

// Mock detailed data for drill-down
const getDetailedAnalysis = (_metricId: string) => {
  // This would come from LLM in production
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

// Mock time series data
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

export function MetricDetailModal({ open, onOpenChange, metric }: MetricDetailModalProps) {
  const analysis = getDetailedAnalysis(metric.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                AI Analysis: {metric.name}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {metric.description}
              </DialogDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{metric.current}</div>
              <div className={`text-sm ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metric.changeLabel} vs prior
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              Confidence: {metric.aiInsight.confidence}%
            </Badge>
            <Badge className="bg-muted text-foreground border-border/60">
              Last updated: 5 mins ago
            </Badge>
            {metric.status === 'excellent' && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Excellent Performance
              </Badge>
            )}
            {metric.status === 'warning' && (
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                <AlertCircle className="h-3 w-3 mr-1" />
                Needs Attention
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="charts">Charts & Trends</TabsTrigger>
              <TabsTrigger value="actions">Recommended Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4 mt-4">
              {/* What Happened */}
              <Card className="p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  🎯 {analysis.what.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{analysis.what.description}</p>
                <div className={`text-sm font-medium ${analysis.what.assessment.includes('POSITIVE') ? 'text-green-600' : 'text-foreground'}`}>
                  ✅ {analysis.what.assessment}
                </div>
              </Card>

              {/* Why It Moved */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  📊 {analysis.why.title}
                </h3>

                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Primary Drivers (72% of the change):</div>
                  {analysis.why.primaryDrivers.map((driver, idx) => (
                    <div key={idx} className="mb-3 pl-4 border-l-2 border-blue-500">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{idx + 1}. {driver.name}</span>
                        <Badge variant="outline" className="text-xs">{driver.contribution}% of lift</Badge>
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {driver.details.map((detail, i) => (
                          <li key={i}>• {detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Secondary Factors (28% of the change):</div>
                  {analysis.why.secondaryFactors.map((factor, idx) => (
                    <div key={idx} className="mb-2 pl-4 border-l-2 border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{idx + 3}. {factor.name}</span>
                        <Badge variant="outline" className="text-xs">{factor.contribution}%</Badge>
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {factor.details.map((detail, i) => (
                          <li key={i}>• {detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Who Drove It */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  👥 {analysis.who.title}
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">By User Type:</div>
                    <div className="space-y-2">
                      {analysis.who.byUserType.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.segment}</span>
                          <div className="flex items-center gap-2">
                            {item.change !== null && (
                              <span className="text-green-600 font-medium">+{item.change}%</span>
                            )}
                            <span className="text-xs text-muted-foreground">{item.impact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">By Geography:</div>
                    <div className="space-y-2">
                      {analysis.who.byGeography.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            {item.region}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 font-medium">+{item.change}%</span>
                            <span className="text-xs text-muted-foreground">({item.note})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">By Product:</div>
                    <div className="space-y-2">
                      {analysis.who.byProduct.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.product}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.share}% of volume</span>
                            <span className="text-xs text-muted-foreground">({item.note})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Forecast */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  🔮 {analysis.forecast.title}
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Expected trajectory:</span> {analysis.forecast.expected}</p>
                  <p><span className="font-medium">Retention campaign impact:</span> {analysis.forecast.retentionImpact}</p>
                  <p><span className="font-medium">Risk factors:</span> {analysis.forecast.riskFactors}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      Confidence: {analysis.forecast.confidence}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">{analysis.forecast.confidenceNote}</span>
                  </div>
                </div>
              </Card>

              {/* Business Implications */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  💡 {analysis.implications.title}
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-green-700 mb-1">This is a strong positive signal:</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {analysis.implications.positive.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-yellow-700 mb-1">However:</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {analysis.implications.however.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Related Metrics */}
              <Card className="p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  📎 Related Metrics to Watch
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {analysis.relatedMetrics.map((metricItem, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3" />
                      {metricItem}
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="charts" className="space-y-4 mt-4">
              {/* Time Series Chart */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">90-Day Trend</h3>
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
              </Card>

              {/* Segment Breakdown */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">By User Segment</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={segmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} label={{ value: '% Change', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Geography Breakdown */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">By Geography</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={geographyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} label={{ value: '% Change', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 mt-4">
              <div className="space-y-3">
                {analysis.actions.map((action, idx) => (
                  <Card key={idx} className={`p-4 ${
                    action.priority === 'IMMEDIATE' ? 'border-red-200 bg-red-50/30' :
                    action.priority === 'THIS WEEK' ? 'border-yellow-200 bg-yellow-50/30' :
                    action.priority === 'STRATEGIC' ? 'border-blue-200 bg-blue-50/30' :
                    'border-purple-200 bg-purple-50/30'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={
                          action.priority === 'IMMEDIATE' ? 'bg-red-100 text-red-700 border-red-200' :
                          action.priority === 'THIS WEEK' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          action.priority === 'STRATEGIC' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          'bg-purple-100 text-purple-700 border-purple-200'
                        }>
                          {action.priority}
                        </Badge>
                        <h4 className="font-semibold">{action.title}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Owner: {action.owner}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Timeline: {action.timeline}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Source Dashboard
                </Button>
                <Button variant="outline" className="flex-1">
                  <Bell className="h-4 w-4 mr-2" />
                  Set Alert if Drops Below 3.9
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
