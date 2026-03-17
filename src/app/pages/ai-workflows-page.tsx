import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Search, Plus, Zap, Play, Pause, CheckCircle, Clock, AlertCircle,
  BarChart3, FileText, Database, RefreshCw, Mail, GitBranch, Calendar,
  ChevronRight, MoreVertical, Users,
} from 'lucide-react';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';

type WorkflowStatus = 'active' | 'paused' | 'completed' | 'failed';

interface Workflow {
  id: string;
  title: string;
  description: string;
  status: WorkflowStatus;
  schedule: string;
  lastRun: string;
  nextRun?: string;
  owner: string;
  shared: boolean;
  steps: number;
  successRate: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  steps: number;
}

const mockWorkflows: Workflow[] = [
  { id: '1', title: 'Weekly Business Review Generator', description: 'Auto-generates WBR slides from key metrics every Monday at 8am', status: 'active', schedule: 'Every Monday 8:00 AM', lastRun: '3 days ago', nextRun: 'Tomorrow 8:00 AM', owner: 'Tony', shared: true, steps: 5, successRate: '98%' },
  { id: '2', title: 'DashPass Churn Alert', description: 'Monitors churn rate and alerts Slack when threshold exceeded', status: 'active', schedule: 'Every 6 hours', lastRun: '2 hours ago', nextRun: 'In 4 hours', owner: 'Tony', shared: false, steps: 3, successRate: '100%' },
  { id: '3', title: 'Merchant Onboarding Report', description: 'Daily report on new merchant signups, activation rates, and first-order metrics', status: 'paused', schedule: 'Daily 9:00 AM', lastRun: '5 days ago', owner: 'A. Patel', shared: true, steps: 4, successRate: '95%' },
  { id: '4', title: 'Data Quality Scorecard', description: 'Runs data quality checks across critical tables and publishes scorecard', status: 'active', schedule: 'Daily 6:00 AM', lastRun: '18 hours ago', nextRun: 'Tomorrow 6:00 AM', owner: 'M. Chen', shared: true, steps: 6, successRate: '92%' },
  { id: '5', title: 'Revenue Anomaly Detection', description: 'ML-based anomaly detection on hourly revenue streams', status: 'failed', schedule: 'Hourly', lastRun: '45 min ago', owner: 'Tony', shared: false, steps: 4, successRate: '87%' },
  { id: '6', title: 'Courier Supply Forecast', description: 'Generates 7-day courier supply forecast by zone', status: 'completed', schedule: 'Daily 5:00 AM', lastRun: '12 hours ago', nextRun: 'Tomorrow 5:00 AM', owner: 'S. Lee', shared: true, steps: 7, successRate: '96%' },
];

const templates: WorkflowTemplate[] = [
  { id: 't1', name: 'Scheduled Report', description: 'Run a query on schedule and deliver results via email or Slack', icon: Mail, category: 'Reporting', steps: 3 },
  { id: 't2', name: 'Data Pipeline Monitor', description: 'Watch for pipeline failures and alert on-call with context', icon: Database, category: 'Monitoring', steps: 4 },
  { id: 't3', name: 'Metric Anomaly Alert', description: 'Detect anomalies in key metrics and trigger notifications', icon: BarChart3, category: 'Alerting', steps: 5 },
  { id: 't4', name: 'Notebook Automation', description: 'Run a notebook on schedule and publish results to a dashboard', icon: FileText, category: 'Automation', steps: 4 },
  { id: 't5', name: 'ETL Orchestration', description: 'Chain SQL transforms with dependency management', icon: GitBranch, category: 'Data Eng', steps: 6 },
  { id: 't6', name: 'Recurring Analysis', description: 'Re-run an AI analysis periodically and track changes over time', icon: RefreshCw, category: 'Analysis', steps: 5 },
];

const statusConfig: Record<WorkflowStatus, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  active: { icon: Play, label: 'Active', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  paused: { icon: Pause, label: 'Paused', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  completed: { icon: CheckCircle, label: 'Completed', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  failed: { icon: AlertCircle, label: 'Failed', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
};

export function AIWorkflowsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'failed'>('all');

  const filteredWorkflows = mockWorkflows.filter((wf) => {
    const matchesSearch = wf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && wf.status === filter;
  });

  const counts = {
    all: mockWorkflows.length,
    active: mockWorkflows.filter(w => w.status === 'active').length,
    paused: mockWorkflows.filter(w => w.status === 'paused').length,
    failed: mockWorkflows.filter(w => w.status === 'failed').length,
  };

  return (
    <div className="h-full flex overflow-hidden">
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6" style={{ color: '#FF3A00' }} />
              <h1 className="text-2xl" style={{ color: '#FF3A00' }}>AI Workflows</h1>
            </div>
            <p className="text-gray-600">
              Automate recurring data tasks — scheduled reports, alerts, pipelines, and AI analyses
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Workflows', value: counts.all, icon: Zap, color: '#FF3A00' },
              { label: 'Active', value: counts.active, icon: Play, color: '#10b981' },
              { label: 'Paused', value: counts.paused, icon: Pause, color: '#f59e0b' },
              { label: 'Failed', value: counts.failed, icon: AlertCircle, color: '#ef4444' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            <Button style={{ backgroundColor: '#FF3A00' }} className="text-white gap-2">
              <Plus className="w-4 h-4" />
              New Workflow
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6">
            {(['all', 'active', 'paused', 'failed'] as const).map((f) => (
              <Button
                key={f}
                variant="outline"
                size="sm"
                className={filter === f ? 'bg-gray-100 text-gray-900' : ''}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </Button>
            ))}
          </div>

          {/* Workflows List */}
          {filteredWorkflows.length > 0 ? (
            <div className="space-y-3 mb-10">
              {filteredWorkflows.map((workflow) => {
                const status = statusConfig[workflow.status];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={workflow.id}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <h3 className="font-medium text-gray-900">{workflow.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${status.bg} ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                          {workflow.shared && <Users className="w-3.5 h-3.5 text-gray-400" />}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                        <div className="flex items-center gap-5 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{workflow.schedule}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Last run: {workflow.lastRun}</span>
                          </div>
                          {workflow.nextRun && (
                            <div className="flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" />
                              <span>Next: {workflow.nextRun}</span>
                            </div>
                          )}
                          <span>{workflow.steps} steps</span>
                          <span>Success rate: {workflow.successRate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {workflow.status === 'active' && (
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            <Pause className="w-3 h-3" /> Pause
                          </Button>
                        )}
                        {workflow.status === 'paused' && (
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            <Play className="w-3 h-3" /> Resume
                          </Button>
                        )}
                        {workflow.status === 'failed' && (
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            <RefreshCw className="w-3 h-3" /> Retry
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </Button>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg mb-10">
              <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">No workflows match your search</p>
            </div>
          )}

          {/* Templates */}
          <div>
            <h2 className="text-lg text-gray-900 mb-4">Workflow Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF0EB' }}>
                      <template.icon className="w-5 h-5" style={{ color: '#FF3A00' }} />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{template.category}</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{template.steps} steps</span>
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#FF3A00' }}>
                      Use template →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AIAssistantSidebar
        title="Workflow Assistant"
        welcomeMessage="Hi! I can help you create, schedule, and debug AI workflows. Ask me to set up alerts, automate reports, or chain data tasks."
        suggestions={[
          { text: 'Create a scheduled report' },
          { text: 'Set up an anomaly alert' },
          { text: 'Debug a failed workflow' },
          { text: 'Chain SQL + notebook' },
        ]}
      />
    </div>
  );
}
