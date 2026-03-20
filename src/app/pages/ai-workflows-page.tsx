import { useState } from 'react';
import { motion } from 'motion/react';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
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
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-dd-primary" />
              <h1 className="text-2xl text-dd-primary">AI Workflows</h1>
            </div>
            <p className="text-muted-foreground">
              Automate recurring data tasks — scheduled reports, alerts, pipelines, and AI analyses
            </p>
          </motion.div>

          {/* Summary Stats */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Workflows', value: counts.all, icon: Zap, color: 'var(--dd-primary)' },
              { label: 'Active', value: counts.active, icon: Play, color: '#10b981' },
              { label: 'Paused', value: counts.paused, icon: Pause, color: '#f59e0b' },
              { label: 'Failed', value: counts.failed, icon: AlertCircle, color: '#ef4444' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={staggerItem} className="bg-white border border-border/60 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Actions Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/50 border-border/60"
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
                className={filter === f ? 'bg-muted text-foreground' : ''}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </Button>
            ))}
          </div>

          {/* Workflows List */}
          {filteredWorkflows.length > 0 ? (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3 mb-10">
              {filteredWorkflows.map((workflow) => {
                const status = statusConfig[workflow.status];
                const StatusIcon = status.icon;
                return (
                  <motion.div
                    key={workflow.id}
                    variants={staggerItem}
                    className="bg-white border border-border/60 rounded-2xl p-5 hover:shadow-card-hover transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <h3 className="font-medium text-foreground">{workflow.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${status.bg} ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                          {workflow.shared && <Users className="w-3.5 h-3.5 text-muted-foreground/60" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>
                        <div className="flex items-center gap-5 text-xs text-muted-foreground">
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
                          <MoreVertical className="w-4 h-4 text-muted-foreground/60" />
                        </Button>
                        <ChevronRight className="w-4 h-4 text-border" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-muted/50 rounded-2xl mb-10">
              <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground/60" />
              <p className="text-muted-foreground mb-4">No workflows match your search</p>
            </div>
          )}

          {/* Templates */}
          <div>
            <h2 className="text-lg text-foreground mb-4">Workflow Templates</h2>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  variants={staggerItem}
                  className="border border-border/60 rounded-2xl p-5 bg-white hover:shadow-card-hover transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF0EB' }}>
                      <template.icon className="w-5 h-5 text-dd-primary" />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{template.category}</span>
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground/60">{template.steps} steps</span>
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity text-dd-primary">
                      Use template →
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
