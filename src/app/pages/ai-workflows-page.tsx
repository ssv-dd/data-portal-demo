import { useState } from 'react';
import { motion } from 'motion/react';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Search, Plus, Zap, Play, Pause, Clock, AlertCircle,
  Calendar, ChevronRight, MoreVertical, Users, RefreshCw, GitBranch, Wand2,
} from 'lucide-react';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { LeftPanel } from '../components/layout/left-panel';
import { WorkflowNodesPanel } from '../components/panels/workflow-nodes-panel';
import { mockWorkflows, templates, statusConfig } from '../data/mock/workflows-data';
import { GradientOrb } from '../components/hero/gradient-orb';

export function AIWorkflowsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'failed'>('all');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftTab, setLeftTab] = useState('workflows');

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
    <div className="h-full bg-background overflow-hidden relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_30%)]" />

      {/* Gradient Orbs */}
      <GradientOrb variant="primary" className="left-[-120px] top-[-20px]" />
      <GradientOrb variant="secondary" className="right-[-80px] top-[120px]" />

      <div className="relative z-10 h-full flex gap-2 p-2">
      {/* Left Panel: Workflows/Nodes */}
      <LeftPanel
        tabs={[
          { key: 'workflows', label: 'Workflows', icon: GitBranch },
          { key: 'nodes', label: 'Nodes', icon: Wand2 },
        ]}
        activeTab={leftTab}
        onTabChange={setLeftTab}
        collapsed={!leftPanelOpen}
        onToggleCollapse={() => setLeftPanelOpen(!leftPanelOpen)}
        showSearch={true}
        searchPlaceholder="Search workflows..."
      >
        <WorkflowNodesPanel activeTab={leftTab} />
      </LeftPanel>

      {/* Center: Workflow List */}
      <div className="flex-1 glass-panel rounded-2xl border border-border/60 dark:border-white/10 overflow-auto">
        <div className="p-8">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              <h1 className="text-2xl text-slate-900 dark:text-white font-semibold">AI Workflows</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
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
              <motion.div key={stat.label} variants={staggerItem} className="bg-background/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
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
                className="pl-10 bg-background/50 border-border/60 dark:border-white/10"
              />
            </div>
            <button className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/[0.15] transition-colors duration-200 shadow-sm">
              <Plus className="h-4 w-4" />
              New workflow
            </button>
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
                    className="bg-background/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/10 rounded-2xl p-5 hover:shadow-card-hover transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <h3 className="font-medium text-slate-900 dark:text-white">{workflow.title}</h3>
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
            <div className="text-center py-16 bg-muted/50 dark:bg-white/[0.04] border border-border/60 dark:border-white/10 rounded-2xl mb-10">
              <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground/60 dark:text-slate-600" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">No workflows match your search</p>
            </div>
          )}

          {/* Templates */}
          <div>
            <h2 className="text-lg text-slate-900 dark:text-white mb-4">Workflow Templates</h2>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  variants={staggerItem}
                  className="border border-border/60 dark:border-white/10 rounded-2xl p-5 bg-background/40 dark:bg-white/[0.04] hover:shadow-card-hover transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-violet-500/10 dark:bg-violet-500/20">
                      <template.icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{template.category}</span>
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground/60">{template.steps} steps</span>
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity text-violet-600 dark:text-violet-400">
                      Use template →
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right: AI Assistant */}
      <AIAssistantSidebar
        title="Workflow Assistant"
        contextLabel="Workflows aware"
        knowledgeBaseId="workflows"
        welcomeMessage="Hi! I can help you create, schedule, and debug AI workflows. Ask me to set up alerts, automate reports, or chain data tasks."
        suggestions={[
          { text: 'Create a scheduled report' },
          { text: 'Set up an anomaly alert' },
          { text: 'Debug a failed workflow' },
          { text: 'Chain SQL + notebook' },
        ]}
        suggestedActions={['Schedule workflow', 'Add trigger', 'View logs']}
      />
      </div>
    </div>
  );
}
