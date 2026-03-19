import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Search, Plus, Zap, Play, Pause, Clock, AlertCircle,
  Calendar, ChevronRight, MoreVertical, Users, RefreshCw,
} from 'lucide-react';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { mockWorkflows, templates, statusConfig } from '../data/mock/workflows-data';

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
              <Zap className="w-6 h-6 text-dd-primary" />
              <h1 className="text-2xl text-dd-primary">AI Workflows</h1>
            </div>
            <p className="text-gray-600">
              Automate recurring data tasks — scheduled reports, alerts, pipelines, and AI analyses
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Workflows', value: counts.all, icon: Zap, color: 'var(--dd-primary)' },
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
            <Button className="bg-dd-primary text-white gap-2">
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
                      <template.icon className="w-5 h-5 text-dd-primary" />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{template.category}</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{template.steps} steps</span>
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity text-dd-primary">
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
