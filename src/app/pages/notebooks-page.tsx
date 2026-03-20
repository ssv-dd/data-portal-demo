import { useState } from 'react';
import { motion } from 'motion/react';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Plus, BookOpen, Search, FileText, Clock, Users, FileCode2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { LeftPanel } from '../components/layout/left-panel';
import { NotebookTemplatesPanel } from '../components/panels/notebook-templates-panel';
import { notebookTemplates, mockNotebooks } from '../data/mock/notebooks-data';
import { GradientOrb } from '../components/hero/gradient-orb';

export function NotebooksPage() {
  const [showScaffoldModal, setShowScaffoldModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [notebookName, setNotebookName] = useState('');
  const [notebookOwner, setNotebookOwner] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftTab, setLeftTab] = useState('recent');

  const filteredNotebooks = mockNotebooks.filter((notebook) => {
    const matchesSearch = notebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notebook.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'mine') return matchesSearch && !notebook.shared;
    if (filter === 'shared') return matchesSearch && notebook.shared;
    return matchesSearch;
  });

  const handleCreateNotebook = () => {
    setShowScaffoldModal(false);
    setSelectedTemplate(null);
    setNotebookName('');
    setNotebookOwner('');
  };

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
      {/* Left Panel: Recent/Templates/Shared */}
      <LeftPanel
        tabs={[
          { key: 'recent', label: 'Recent', icon: Clock },
          { key: 'templates', label: 'Templates', icon: FileCode2 },
          { key: 'shared', label: 'Shared', icon: Users },
        ]}
        activeTab={leftTab}
        onTabChange={handleTabChange}
        collapsed={!leftPanelOpen}
        onToggleCollapse={() => setLeftPanelOpen(!leftPanelOpen)}
      >
        <NotebookTemplatesPanel activeTab={leftTab} />
      </LeftPanel>

      {/* Center: Notebook Grid */}
      <div className="flex-1 glass-panel rounded-2xl border border-border/60 dark:border-white/10 overflow-auto">
        <div className="p-8">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              <h1 className="text-2xl text-slate-900 dark:text-white font-semibold">Notebooks</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Clone existing notebooks or create new ones from templates
            </p>
          </motion.div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <Input
                placeholder="Search notebooks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/60 dark:border-white/10"
              />
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/[0.15] transition-colors duration-200 shadow-sm"
              onClick={() => setShowScaffoldModal(true)}
            >
              <Plus className="h-4 w-4" />
              New Notebook
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="sm" className={filter === 'all' ? 'bg-muted text-foreground' : ''} onClick={() => { setFilter('all'); setLeftTab('recent'); }}>All</Button>
            <Button variant="outline" size="sm" className={filter === 'mine' ? 'bg-muted text-foreground' : ''} onClick={() => { setFilter('mine'); setLeftTab('templates'); }}>My Notebooks</Button>
            <Button variant="outline" size="sm" className={filter === 'shared' ? 'bg-muted text-foreground' : ''} onClick={() => { setFilter('shared'); setLeftTab('shared'); }}>Shared with me</Button>
          </div>

          {filteredNotebooks.length > 0 ? (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredNotebooks.map((notebook) => (
                <motion.div
                  key={notebook.id}
                  variants={staggerItem}
                  className="bg-background/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/10 rounded-2xl p-5 hover:shadow-card-hover transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-muted-foreground/60 dark:text-slate-500" />
                      <h3 className="font-medium text-slate-900 dark:text-white">{notebook.title}</h3>
                    </div>
                    {notebook.shared && <Users className="w-4 h-4 text-muted-foreground/60 dark:text-slate-500" />}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{notebook.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{notebook.lastEdited}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{notebook.cells} cells</span>
                      <span className="px-1.5 py-0.5 bg-muted dark:bg-white/10 rounded text-muted-foreground dark:text-slate-400">{notebook.language}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-muted/50 dark:bg-white/[0.04] border border-border/60 dark:border-white/10 rounded-2xl mb-10">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/60 dark:text-slate-600" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">No notebooks found</p>
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/[0.15] transition-colors duration-200 shadow-sm"
                onClick={() => setShowScaffoldModal(true)}
              >
                <Plus className="h-4 w-4" />
                Create your first notebook
              </button>
            </div>
          )}

          <div>
            <h2 className="text-lg text-slate-900 dark:text-white mb-4">Get Started with Templates</h2>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notebookTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  variants={staggerItem}
                  className="border border-border/60 dark:border-white/10 rounded-2xl p-6 bg-background/40 dark:bg-white/[0.04] hover:shadow-card-hover transition-shadow cursor-pointer group"
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setShowScaffoldModal(true);
                  }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-violet-500/10 dark:bg-violet-500/20">
                    <template.icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-base font-medium text-slate-900 dark:text-white mb-1">{template.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{template.description}</p>
                  <span className="text-xs text-slate-600 dark:text-slate-500">{template.cells} pre-configured cells</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right: AI Assistant */}
      <AIAssistantSidebar
        title="Notebook Assistant"
        contextLabel="Notebooks aware"
        knowledgeBaseId="notebooks"
        welcomeMessage="Hi! I can help you find/navigate existing notebooks, read notebook contents and summarize what the code does, execute code snippets within the chat"
        suggestions={[
          { text: 'Find my notebooks' },
          { text: 'Summarize this code' },
          { text: 'Execute code snippet' },
          { text: 'Explain this analysis' },
        ]}
        suggestedActions={['Run cell', 'Add markdown', 'Import library']}
      />
      </div>

      <Dialog open={showScaffoldModal} onOpenChange={setShowScaffoldModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Notebook</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-1.5">Template</Label>
              <select
                className="w-full px-3 py-2 border border-border/60 rounded-md text-sm bg-background"
                value={selectedTemplate || ''}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="">Select a template</option>
                {notebookTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="mb-1.5">Notebook Name</Label>
              <Input
                placeholder="e.g., Q1 Revenue Analysis"
                value={notebookName}
                onChange={(e) => setNotebookName(e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-1.5">Owner</Label>
              <Input
                placeholder="e.g., J. Smith"
                value={notebookOwner}
                onChange={(e) => setNotebookOwner(e.target.value)}
              />
            </div>

            {selectedTemplate && (
              <div className="bg-muted/50 p-4 rounded-lg border border-border/60">
                <p className="text-sm text-foreground">
                  This template includes pre-configured cells for data loading, exploration, and visualization.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowScaffoldModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-dd-primary text-white"
                onClick={handleCreateNotebook}
                disabled={!selectedTemplate || !notebookName}
              >
                Create Notebook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
