import { Sparkles, ChevronUp, ChevronDown, TrendingUp, ArrowRight, LayoutDashboard, Code2, FileText, Copy, Download, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface AnalysisChartDataPoint {
  date: string;
  subscribers: number;
  target: number;
}

interface AnalysisSummaryRow {
  region: string;
  subs: string;
  growth: string;
  retention: string;
  aov: string;
  trend: 'up' | 'down';
}

interface AnalysisResponseProps {
  chartData: AnalysisChartDataPoint[];
  summaryData: AnalysisSummaryRow[];
}

export function AnalysisResponse({ chartData, summaryData }: AnalysisResponseProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-muted/50 rounded-xl border border-border/60">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-600 dark:bg-violet-500">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Completed in 3 minutes and 4 seconds</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">High confidence</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground">
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground">
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground">
            <Share2 className="w-3.5 h-3.5" />
          </Button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-muted-foreground/60 hover:text-muted-foreground ml-1"
          >
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">DashPass Growth Deep-Dive</h2>
            <p className="text-sm text-muted-foreground">Analysis period: Jan 15 – Mar 16, 2026 (60 days)</p>
          </div>

          {/* Section 1: Metric Definitions */}
          <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
            <div className="px-5 py-3 bg-muted/50 border-b border-border/60">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Metric Definitions & Methodology</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase">Active Subscribers</div>
                    <div className="text-sm text-foreground mt-0.5">Users with active DashPass billing in the period. Excludes trial and paused.</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase">MoM Growth</div>
                    <div className="text-sm text-foreground mt-0.5">Month-over-month change in active subscribers, seasonally adjusted.</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase">Retention Rate</div>
                    <div className="text-sm text-foreground mt-0.5">Percentage of subscribers renewing at end of billing cycle (30-day rolling).</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase">Avg. Order Value (AOV)</div>
                    <div className="text-sm text-foreground mt-0.5">Mean order value for DashPass members, pre-tip and pre-discount.</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40">
                <p className="text-xs text-muted-foreground/60">Sources: billing_events, subscription_status, orders_completed | Warehouse: Snowflake prod | Last refreshed: 12 min ago</p>
              </div>
            </div>
          </div>

          {/* Section 2: Executive Summary Table */}
          <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
            <div className="px-5 py-3 bg-muted/50 border-b border-border/60">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Executive Summary by Region</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Region</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Subscribers</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Growth (MoM)</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Retention</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">AOV</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.map((row, i) => (
                    <tr key={row.region} className={`border-b border-border/40 ${i === 0 ? 'bg-violet-50/40 dark:bg-violet-950/20 font-medium' : 'hover:bg-accent/40'}`}>
                      <td className="px-5 py-3 text-foreground">{row.region}</td>
                      <td className="px-5 py-3 text-right text-foreground">{row.subs}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-400">
                          <TrendingUp className="w-3 h-3" />
                          {row.growth}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-foreground">{row.retention}</td>
                      <td className="px-5 py-3 text-right text-foreground">{row.aov}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Key Takeaways */}
          <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
            <div className="px-5 py-3 bg-muted/50 border-b border-border/60">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Key Takeaways & Trend Highlights</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <TrendingUp className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-green-900">Subscriptions surpassed 14M milestone</div>
                  <div className="text-xs text-green-700 mt-0.5">14.2M active subscribers — 12.4% MoM growth, well ahead of 10% target. The fastest growth period since Q2 2025.</div>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <TrendingUp className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-green-900">Retention improved +3.2pp to 87.3%</div>
                  <div className="text-xs text-green-700 mt-0.5">Driven by the new "pause instead of cancel" flow shipped Feb 1. Churn rate dropped from 15.9% to 12.7%.</div>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <ArrowRight className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-amber-900">Order frequency gap widening</div>
                  <div className="text-xs text-amber-700 mt-0.5">DashPass members order 4.2x/week vs 1.8x for non-members (ratio: 2.3x, up from 2.1x). Suggests strong value lock-in.</div>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <TrendingUp className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-900">SF Bay Area leads regional growth at +18.2%</div>
                  <div className="text-xs text-blue-700 mt-0.5">Correlated with the Feb 10 "DashPass for Families" launch in Bay Area. NYC (+15%) and Chicago (+13%) also strong.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Growth Trend Chart */}
          <div className="bg-white rounded-xl border border-border/60 overflow-hidden relative group">
            <div className="px-5 py-3 bg-muted/50 border-b border-border/60 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Subscriber Growth Trend</h3>
              <span className="text-xs text-muted-foreground/60">60-day window • millions</span>
            </div>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="subscriberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis domain={[10.5, 15]} tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${v}M`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                    formatter={(value) => [`${value}M`, '']}
                  />
                  <Area type="monotone" dataKey="subscribers" stroke="#7c3aed" strokeWidth={2.5} fill="url(#subscriberGradient)" name="Actual" />
                  <Line type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="6 3" dot={false} name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Hover action buttons */}
            <div className="absolute top-12 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-white shadow-md hover:bg-accent/40 border-border text-xs h-7">
                  <LayoutDashboard className="w-3.5 h-3.5 mr-1" />
                  Add to Dashboard
                </Button>
                <Button size="sm" variant="outline" className="bg-white shadow-md hover:bg-accent/40 border-border text-xs h-7">
                  <Code2 className="w-3.5 h-3.5 mr-1" />
                  Open SQL
                </Button>
                <Button size="sm" variant="outline" className="bg-white shadow-md hover:bg-accent/40 border-border text-xs h-7">
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  Notebook
                </Button>
              </div>
            </div>
          </div>

          {/* Section 5: Recommended Next Cuts */}
          <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
            <div className="px-5 py-3 bg-muted/50 border-b border-border/60">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Recommended Next Cuts</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-muted-foreground mb-4">Based on this analysis, the agent suggests these follow-up explorations:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { q: 'Break down growth by acquisition channel (organic vs paid vs referral)', tag: 'Segmentation' },
                  { q: 'Compare "pause instead of cancel" cohort retention vs control', tag: 'A/B Analysis' },
                  { q: 'DashPass for Families adoption by market since Feb 10 launch', tag: 'Feature Impact' },
                  { q: 'Predict next 30-day subscriber trajectory with current trends', tag: 'Forecast' },
                ].map((item) => (
                  <button
                    key={item.q}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-border/60 hover:border-border-strong hover:bg-accent/40 transition-all text-left group/item"
                  >
                    <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-violet-600 dark:text-violet-400" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-foreground group-hover/item:text-foreground">{item.q}</div>
                      <div className="text-xs text-muted-foreground/60 mt-1">{item.tag}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover/item:text-muted-foreground shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
