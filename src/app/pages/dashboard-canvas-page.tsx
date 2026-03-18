import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Share2, Settings, Eye, Plus, GripVertical, MoreVertical, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';

const COLORS = ['#FF3A00', '#FF6B3D', '#FF9C7A', '#FFCDB7', '#FFE8DF'];

const ordersData = [
  { name: 'Mon', value: 12400 }, { name: 'Tue', value: 13100 },
  { name: 'Wed', value: 14200 }, { name: 'Thu', value: 13800 },
  { name: 'Fri', value: 15600 }, { name: 'Sat', value: 18200 },
  { name: 'Sun', value: 17100 },
];

const revenueData = [
  { name: 'Jan', value: 42 }, { name: 'Feb', value: 45 },
  { name: 'Mar', value: 48 }, { name: 'Apr', value: 51 },
  { name: 'May', value: 49 }, { name: 'Jun', value: 55 },
];

const latencyData = [
  { name: 'SF', value: 28 }, { name: 'NYC', value: 32 },
  { name: 'LA', value: 35 }, { name: 'CHI', value: 30 },
  { name: 'BOS', value: 27 },
];

const marketShareData = [
  { name: 'DoorDash', value: 67 }, { name: 'Uber Eats', value: 23 },
  { name: 'Grubhub', value: 7 }, { name: 'Other', value: 3 },
];

interface WidgetConfig {
  id: string;
  title: string;
  subtitle: string;
  type: 'bar' | 'line' | 'area' | 'pie' | 'kpi';
  data?: any[];
  kpiValue?: string;
  kpiChange?: string;
  kpiTrend?: 'up' | 'down' | 'flat';
  span?: 1 | 2;
}

const widgets: WidgetConfig[] = [
  { id: 'w1', title: 'Total Orders', subtitle: 'This week', type: 'kpi', kpiValue: '104,400', kpiChange: '+8.2%', kpiTrend: 'up', span: 1 },
  { id: 'w2', title: 'Revenue (GMV)', subtitle: 'Last 6 months ($M)', type: 'kpi', kpiValue: '$290M', kpiChange: '+12.4%', kpiTrend: 'up', span: 1 },
  { id: 'w3', title: 'Avg Delivery Time', subtitle: 'P50, minutes', type: 'kpi', kpiValue: '30.4 min', kpiChange: '-2.1%', kpiTrend: 'down', span: 1 },
  { id: 'w4', title: 'Active Dashers', subtitle: 'Currently online', type: 'kpi', kpiValue: '48,291', kpiChange: '+0.3%', kpiTrend: 'flat', span: 1 },
  { id: 'w5', title: 'Orders by Day', subtitle: 'This week', type: 'bar', data: ordersData, span: 1 },
  { id: 'w6', title: 'Revenue Trend', subtitle: 'Monthly GMV ($M)', type: 'area', data: revenueData, span: 1 },
  { id: 'w7', title: 'Delivery Latency by City', subtitle: 'P50 minutes, last 14 days', type: 'bar', data: latencyData, span: 1 },
  { id: 'w8', title: 'Market Share', subtitle: 'US delivery platforms', type: 'pie', data: marketShareData, span: 1 },
];

export function DashboardCanvasPage() {
  const [showPublishModal, setShowPublishModal] = useState(false);

  const renderChart = (widget: WidgetConfig) => {
    switch (widget.type) {
      case 'kpi':
        return (
          <div className="flex flex-col justify-center h-full">
            <div className="text-3xl font-bold text-gray-900 mb-2">{widget.kpiValue}</div>
            <div className="flex items-center gap-1.5">
              {widget.kpiTrend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
              {widget.kpiTrend === 'down' && <TrendingDown className="w-4 h-4 text-green-600" />}
              {widget.kpiTrend === 'flat' && <Minus className="w-4 h-4 text-gray-400" />}
              <span className={`text-sm font-medium ${
                widget.kpiTrend === 'flat' ? 'text-gray-500' : 'text-green-600'
              }`}>
                {widget.kpiChange}
              </span>
              <span className="text-xs text-gray-400">vs prev period</span>
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
              <Bar dataKey="value" fill="#FF3A00" radius={[4, 4, 0, 0]} />
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
              <Line type="monotone" dataKey="value" stroke="#FF3A00" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={widget.data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3A00" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FF3A00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Area type="monotone" dataKey="value" stroke="#FF3A00" strokeWidth={2} fill="url(#areaGradient)" />
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
    <div className="h-full flex">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-gray-200 bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl text-gray-900">Q1 Operations Dashboard</h1>
              <p className="text-sm text-gray-500">Last edited 2 hours ago · 8 widgets</p>
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
                style={{ backgroundColor: '#FF3A00' }}
                className="text-white gap-2 text-sm"
                onClick={() => setShowPublishModal(true)}
              >
                <Share2 className="w-4 h-4" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`bg-white border border-gray-200 rounded-lg overflow-hidden group ${
                  widget.span === 2 ? 'col-span-2' : 'col-span-1'
                }`}
              >
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <GripVertical className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{widget.title}</h4>
                      <p className="text-xs text-gray-500 truncate">{widget.subtitle}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className={widget.type === 'kpi' ? 'px-4 pb-4 h-24' : 'px-2 pb-3 h-48'}>
                  {renderChart(widget)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AIAssistantSidebar
        title="Canvas Assistant"
        welcomeMessage="I can help you add widgets, rearrange your dashboard, or generate summaries from your metrics."
        suggestions={[
          { text: 'Add a KPI card' },
          { text: 'Generate summary' },
          { text: 'Compare periods' },
          { text: 'Add trend chart' },
        ]}
      />

      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Publish Dashboard</DialogTitle>
            <DialogDescription>
              Share this dashboard with your organization. Verified metrics will power automated narrative summaries.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-900 font-medium mb-1">Q1 Operations Dashboard</div>
              <div className="text-xs text-gray-500">8 widgets · 4 verified metrics</div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPublishModal(false)}>
                Save as Draft
              </Button>
              <Button
                style={{ backgroundColor: '#FF3A00' }}
                className="text-white"
                onClick={() => setShowPublishModal(false)}
              >
                Publish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
