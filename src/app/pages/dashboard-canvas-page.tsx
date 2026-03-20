import { useState } from 'react';
import { motion } from 'motion/react';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Share2, Settings, Eye, Plus, GripVertical, MoreVertical, TrendingUp, TrendingDown, Minus, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { LeftPanel } from '../components/layout/left-panel';
import { MetricsLibraryPanel } from '../components/panels/metrics-library-panel';
import { COLORS, widgets } from '../data/mock/dashboard-canvas-data';
import type { WidgetConfig } from '@/types';
import { GradientOrb } from '../components/hero/gradient-orb';

export function DashboardCanvasPage() {
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftTab, setLeftTab] = useState('metrics');

  const handleMetricAdd = (metric: any) => {
    console.log('Adding metric:', metric);
    // Future: Add metric to canvas
  };

  const renderChart = (widget: WidgetConfig) => {
    switch (widget.type) {
      case 'kpi':
        return (
          <div className="flex flex-col justify-center h-full">
            <div className="text-3xl font-bold text-foreground mb-2">{widget.kpiValue}</div>
            <div className="flex items-center gap-1.5">
              {widget.kpiTrend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
              {widget.kpiTrend === 'down' && <TrendingDown className="w-4 h-4 text-green-600" />}
              {widget.kpiTrend === 'flat' && <Minus className="w-4 h-4 text-muted-foreground/60" />}
              <span className={`text-sm font-medium ${
                widget.kpiTrend === 'flat' ? 'text-muted-foreground' : 'text-green-600'
              }`}>
                {widget.kpiChange}
              </span>
              <span className="text-xs text-muted-foreground/60">vs prev period</span>
            </div>
          </div>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={widget.data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Bar dataKey="value" fill="var(--dd-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={widget.data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Line type="monotone" dataKey="value" stroke="var(--dd-primary)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={widget.data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--dd-primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--dd-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Area type="monotone" dataKey="value" stroke="var(--dd-primary)" strokeWidth={2} fill="url(#areaGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={widget.data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {widget.data!.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="h-full bg-background overflow-hidden relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_30%)]" />

      {/* Gradient Orbs */}
      <GradientOrb variant="primary" className="left-[-120px] top-[-20px]" />
      <GradientOrb variant="secondary" className="right-[-80px] top-[120px]" />

      <div className="relative z-10 h-full flex gap-2 p-2">
      {/* Left Panel: Metric Library */}
      <LeftPanel
        tabs={[
          { key: 'metrics', label: 'Metrics', icon: BarChart3 },
          { key: 'charts', label: 'Charts', icon: LineChartIcon },
        ]}
        activeTab={leftTab}
        onTabChange={setLeftTab}
        collapsed={!leftPanelOpen}
        onToggleCollapse={() => setLeftPanelOpen(!leftPanelOpen)}
        showSearch={true}
        searchPlaceholder="Search metrics..."
      >
        <MetricsLibraryPanel onMetricAdd={handleMetricAdd} />
      </LeftPanel>

      {/* Center: Canvas Builder */}
      <div className="flex-1 flex flex-col overflow-hidden glass-panel rounded-2xl border border-border/60 dark:border-white/10">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <div className="border-b border-border/60 dark:border-white/10 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl text-slate-900 dark:text-white">Q1 Operations Dashboard</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Last edited 2 hours ago · 8 widgets</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  Add Widget
                </Button>
                <Button variant="outline" className="gap-2 text-sm">
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button variant="outline" className="gap-2 text-sm">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button
                  className="bg-dd-primary text-white gap-2 text-sm"
                  onClick={() => setShowPublishModal(true)}
                >
                  <Share2 className="w-4 h-4" />
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 overflow-auto bg-muted/50 dark:bg-slate-950/40 p-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
            {widgets.map((widget) => (
              <motion.div
                key={widget.id}
                variants={staggerItem}
                className={widget.span === 2 ? 'col-span-2' : 'col-span-1'}
              >
                <div
                  className="bg-background dark:bg-slate-900/50 border border-border/60 dark:border-white/10 rounded-2xl overflow-hidden group h-full"
                >
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <GripVertical className="w-4 h-4 text-muted-foreground/60 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">{widget.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{widget.subtitle}</p>
                      </div>
                    </div>
                    <button className="text-muted-foreground/60 dark:text-slate-600 hover:text-muted-foreground dark:hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <div className={widget.type === 'kpi' ? 'px-4 pb-4 h-24' : 'px-2 pb-3 h-48'}>
                    {renderChart(widget)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right: AI Assistant */}
      <AIAssistantSidebar
        title="Canvas Assistant"
        contextLabel="Dashboard aware"
        knowledgeBaseId="dashboards"
        welcomeMessage="I can help you add widgets, rearrange your dashboard, or generate summaries from your metrics."
        suggestions={[
          { text: 'Add a KPI card' },
          { text: 'Generate summary' },
          { text: 'Compare periods' },
          { text: 'Add trend chart' },
        ]}
        suggestedActions={['Add metric', 'Create chart', 'Export to PDF']}
      />
      </div>

      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Publish Dashboard</DialogTitle>
            <DialogDescription>
              Share this dashboard with your organization. Verified metrics will power automated narrative summaries.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-2xl p-4">
              <div className="text-sm text-foreground font-medium mb-1">Q1 Operations Dashboard</div>
              <div className="text-xs text-muted-foreground">8 widgets · 4 verified metrics</div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPublishModal(false)}>
                Save as Draft
              </Button>
              <Button
                className="bg-dd-primary text-white"
                onClick={() => setShowPublishModal(false)}
              >
                Publish Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
