import { useState } from 'react';
import { motion } from 'motion/react';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, Grid2x2, FileText, Clock, Users, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { LeftPanel } from '../components/layout/left-panel';
import { DashboardLibraryPanel } from '../components/panels/dashboard-library-panel';
import { mockCanvases } from '../data/mock/canvas-data';
import { GradientOrb } from '../components/hero/gradient-orb';

export function MyCanvasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftTab, setLeftTab] = useState('recent');
  const navigate = useNavigate();

  const filteredCanvases = mockCanvases.filter((canvas) => {
    const matchesSearch = canvas.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      canvas.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'mine') return matchesSearch && !canvas.shared;
    if (filter === 'shared') return matchesSearch && canvas.shared;
    return matchesSearch;
  });

  // Sync filter with left panel tab
  const handleTabChange = (tab: string) => {
    setLeftTab(tab);
    if (tab === 'recent') setFilter('all');
    else if (tab === 'templates') setFilter('mine');
    else if (tab === 'shared') setFilter('shared');
  };

  return (
    <div className="h-full bg-background overflow-hidden relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_30%)]" />

      {/* Gradient Orbs */}
      <GradientOrb variant="primary" className="left-[-120px] top-[-20px]" />
      <GradientOrb variant="secondary" className="right-[-80px] top-[120px]" />

      <div className="relative z-10 h-full flex gap-2 p-2">
      {/* Left Panel: Dashboard Library */}
      <LeftPanel
        tabs={[
          { key: 'recent', label: 'Recent', icon: Clock },
          { key: 'templates', label: 'Canvases', icon: LayoutDashboard },
          { key: 'shared', label: 'Shared', icon: Users },
        ]}
        activeTab={leftTab}
        onTabChange={handleTabChange}
        collapsed={!leftPanelOpen}
        onToggleCollapse={() => setLeftPanelOpen(!leftPanelOpen)}
        showSearch={true}
        searchPlaceholder="Search canvases..."
      >
        <DashboardLibraryPanel
          activeTab={leftTab}
          onDashboardClick={() => navigate('/dashboard/draft')}
        />
      </LeftPanel>

      {/* Center: Canvas Grid */}
      <div className="flex-1 glass-panel rounded-2xl border border-border/60 dark:border-white/10 overflow-auto">
        <div className="p-8">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Grid2x2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                <h1 className="text-2xl text-slate-900 dark:text-white font-semibold">Dashboards</h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Create and manage metric dashboards. Open a canvas to edit or start a new one
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <Input
                placeholder="Search canvases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/60 dark:border-white/10"
              />
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/[0.15] transition-colors duration-200 shadow-sm"
              onClick={() => navigate('/dashboard/draft')}
            >
              <Plus className="h-4 w-4" />
              New Canvas
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              className={filter === 'all' ? 'bg-muted text-foreground' : ''}
              onClick={() => { setFilter('all'); setLeftTab('recent'); }}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={filter === 'mine' ? 'bg-muted text-foreground' : ''}
              onClick={() => { setFilter('mine'); setLeftTab('templates'); }}
            >
              My Canvases
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={filter === 'shared' ? 'bg-muted text-foreground' : ''}
              onClick={() => { setFilter('shared'); setLeftTab('shared'); }}
            >
              Shared with me
            </Button>
          </div>

          {filteredCanvases.length > 0 ? (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCanvases.map((canvas) => (
                <motion.div variants={staggerItem} key={canvas.id}>
                  <div
                    className="bg-background/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/10 rounded-2xl p-5 hover:shadow-card-hover transition-shadow cursor-pointer"
                    onClick={() => navigate('/dashboard/draft')}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-muted-foreground/60 dark:text-slate-500" />
                        <h3 className="font-medium text-slate-900 dark:text-white">{canvas.title}</h3>
                      </div>
                      {canvas.shared && (
                        <Users className="w-4 h-4 text-muted-foreground/60 dark:text-slate-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{canvas.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{canvas.lastEdited}</span>
                      </div>
                      <span>{canvas.metrics} metrics</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-muted/50 dark:bg-white/[0.04] border border-border/60 dark:border-white/10 rounded-2xl">
              <Grid2x2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/60 dark:text-slate-600" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">No canvases found</p>
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/[0.15] transition-colors duration-200 shadow-sm"
                onClick={() => navigate('/dashboard/draft')}
              >
                <Plus className="h-4 w-4" />
                Create your first canvas
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: AI Assistant */}
      <AIAssistantSidebar title="Dashboard Assistant" />
      </div>
    </div>
  );
}
