import { Sparkles, ChevronUp, ChevronDown, TrendingUp, ArrowRight, LayoutDashboard, Code2, FileText, Copy, Download, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const chartData = [
  { date: 'Jan 15', subscribers: 11.2, target: 11.0 },
  { date: 'Jan 22', subscribers: 11.5, target: 11.2 },
  { date: 'Jan 29', subscribers: 11.8, target: 11.4 },
  { date: 'Feb 5', subscribers: 12.1, target: 11.6 },
  { date: 'Feb 12', subscribers: 12.0, target: 11.8 },
  { date: 'Feb 19', subscribers: 12.4, target: 12.0 },
  { date: 'Feb 26', subscribers: 12.9, target: 12.2 },
  { date: 'Mar 5', subscribers: 13.3, target: 12.4 },
  { date: 'Mar 12', subscribers: 13.8, target: 12.6 },
  { date: 'Mar 16', subscribers: 14.2, target: 12.8 },
];

const summaryData = [
  { region: 'US — Overall', subs: '14.2M', growth: '+12.4%', retention: '87.3%', aov: '$38.50', trend: 'up' as const },
  { region: 'SF Bay Area', subs: '1.8M', growth: '+18.2%', retention: '91.1%', aov: '$42.10', trend: 'up' as const },
  { region: 'NYC Metro', subs: '2.1M', growth: '+15.0%', retention: '88.7%', aov: '$40.30', trend: 'up' as const },
  { region: 'Chicago', subs: '1.2M', growth: '+13.1%', retention: '86.2%', aov: '$35.80', trend: 'up' as const },
  { region: 'LA / SoCal', subs: '1.6M', growth: '+9.8%', retention: '85.4%', aov: '$37.20', trend: 'up' as const },
  { region: 'Other', subs: '7.5M', growth: '+10.2%', retention: '86.0%', aov: '$36.90', trend: 'up' as const },
];

export function AnalysisResponse() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF3A00' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Completed in 3 minutes and 4 seconds</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">High confidence</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-500">
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-500">
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-500">
            <Share2 className="w-3.5 h-3.5" />
          </Button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-gray-600 ml-1"
          >
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">DashPass Growth Deep-Dive</h2>
            <p className="text-sm text-gray-500">Analysis period: Jan 15 – Mar 16, 2026 (60 days)</p>
          </div>

          {/* Section 1: Metric Definitions */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Metric Definitions & Methodology</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Active Subscribers</div>
                    <div className="text-sm text-gray-700 mt-0.5">Users with active DashPass billing in the period. Excludes trial and paused.</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">MoM Growth</div>
                    <div className="text-sm text-gray-700 mt-0.5">Month-over-month change in active subscribers, seasonally adjusted.</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Retention Rate</div>
                    <div className="text-sm text-gray-700 mt-0.5">Percentage of subscribers renewing at end of billing cycle (30-day rolling).</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Avg. Order Value (AOV)</div>
                    <div className="text-sm text-gray-700 mt-0.5">Mean order value for DashPass members, pre-tip and pre-discount.</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">Sources: billing_events, subscription_status, orders_completed | Warehouse: Snowflake prod | Last refreshed: 12 min ago</p>
              </div>
            </div>
          </div>

          {/* Section 2: Executive Summary Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Executive Summary by Region</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Region</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Subscribers</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Growth (MoM)</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Retention</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">AOV</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.map((row, i) => (
                    <tr key={row.region} className={`border-b border-gray-100 ${i === 0 ? 'bg-orange-50/40 font-medium' : 'hover:bg-gray-50'}`}>
                      <td className="px-5 py-3 text-gray-900">{row.region}</td>
                      <td className="px-5 py-3 text-right text-gray-700">{row.subs}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-green-700">
                          <TrendingUp className="w-3 h-3" />
                          {row.growth}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-gray-700">{row.retention}</td>
                      <td className="px-5 py-3 text-right text-gray-700">{row.aov}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Key Takeaways */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Key Takeaways & Trend Highlights</h3>
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
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative group">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Subscriber Growth Trend</h3>
              <span className="text-xs text-gray-400">60-day window • millions</span>
            </div>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="subscriberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF3A00" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#FF3A00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis domain={[10.5, 15]} tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${v}M`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                    formatter={(value) => [`${value}M`, '']}
                  />
                  <Area type="monotone" dataKey="subscribers" stroke="#FF3A00" strokeWidth={2.5} fill="url(#subscriberGradient)" name="Actual" />
                  <Line type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="6 3" dot={false} name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Hover action buttons */}
            <div className="absolute top-12 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-white shadow-md hover:bg-gray-50 border-gray-300 text-xs h-7">
                  <LayoutDashboard className="w-3.5 h-3.5 mr-1" />
                  Add to Dashboard
                </Button>
                <Button size="sm" variant="outline" className="bg-white shadow-md hover:bg-gray-50 border-gray-300 text-xs h-7">
                  <Code2 className="w-3.5 h-3.5 mr-1" />
                  Open SQL
                </Button>
                <Button size="sm" variant="outline" className="bg-white shadow-md hover:bg-gray-50 border-gray-300 text-xs h-7">
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  Notebook
                </Button>
              </div>
            </div>
          </div>

          {/* Section 5: Recommended Next Cuts */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Recommended Next Cuts</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4">Based on this analysis, the agent suggests these follow-up explorations:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { q: 'Break down growth by acquisition channel (organic vs paid vs referral)', tag: 'Segmentation' },
                  { q: 'Compare "pause instead of cancel" cohort retention vs control', tag: 'A/B Analysis' },
                  { q: 'DashPass for Families adoption by market since Feb 10 launch', tag: 'Feature Impact' },
                  { q: 'Predict next 30-day subscriber trajectory with current trends', tag: 'Forecast' },
                ].map((item) => (
                  <button
                    key={item.q}
                    className="flex items-start gap-3 p-3.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-left group/item"
                  >
                    <Sparkles className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#FF3A00' }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-800 group-hover/item:text-gray-900">{item.q}</div>
                      <div className="text-xs text-gray-400 mt-1">{item.tag}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover/item:text-gray-500 shrink-0 mt-0.5" />
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
