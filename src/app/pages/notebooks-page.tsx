import { useState } from 'react';
import { motion } from 'motion/react';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Plus, BookOpen, Search, FileText, Clock, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { notebookTemplates, mockNotebooks } from '../data/mock/notebooks-data';

export function NotebooksPage() {
  const [showScaffoldModal, setShowScaffoldModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [notebookName, setNotebookName] = useState('');
  const [notebookOwner, setNotebookOwner] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all');

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

  return (
    <div className="h-full flex overflow-hidden">
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-dd-primary" />
              <h1 className="text-2xl text-dd-primary">Notebooks</h1>
            </div>
            <p className="text-muted-foreground">
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
                className="pl-10 bg-muted/50 border-border/60"
              />
            </div>
            <Button
              className="bg-dd-primary text-white gap-2"
              onClick={() => setShowScaffoldModal(true)}
            >
              <Plus className="w-4 h-4" />
              New Notebook
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="sm" className={filter === 'all' ? 'bg-muted text-foreground' : ''} onClick={() => setFilter('all')}>All</Button>
            <Button variant="outline" size="sm" className={filter === 'mine' ? 'bg-muted text-foreground' : ''} onClick={() => setFilter('mine')}>My Notebooks</Button>
            <Button variant="outline" size="sm" className={filter === 'shared' ? 'bg-muted text-foreground' : ''} onClick={() => setFilter('shared')}>Shared with me</Button>
          </div>

          {filteredNotebooks.length > 0 ? (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredNotebooks.map((notebook) => (
                <motion.div
                  key={notebook.id}
                  variants={staggerItem}
                  className="bg-white border border-border/60 rounded-2xl p-5 hover:shadow-card-hover transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-muted-foreground/60" />
                      <h3 className="font-medium text-foreground">{notebook.title}</h3>
                    </div>
                    {notebook.shared && <Users className="w-4 h-4 text-muted-foreground/60" />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{notebook.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{notebook.lastEdited}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{notebook.cells} cells</span>
                      <span className="px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{notebook.language}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-muted/50 rounded-2xl mb-10">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/60" />
              <p className="text-muted-foreground mb-4">No notebooks found</p>
              <Button className="bg-dd-primary text-white gap-2" onClick={() => setShowScaffoldModal(true)}>
                <Plus className="w-4 h-4" />
                Create your first notebook
              </Button>
            </div>
          )}

          <div>
            <h2 className="text-lg text-foreground mb-4">Get Started with Templates</h2>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notebookTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  variants={staggerItem}
                  className="border border-border/60 rounded-2xl p-6 bg-white hover:shadow-card-hover transition-shadow cursor-pointer group"
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setShowScaffoldModal(true);
                  }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#FFF0EB' }}>
                    <template.icon className="w-5 h-5 text-dd-primary" />
                  </div>
                  <h3 className="text-base font-medium text-foreground mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <span className="text-xs text-muted-foreground/60">{template.cells} pre-configured cells</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <AIAssistantSidebar
        title="Notebook Assistant"
        welcomeMessage="Hi! I can help you find/navigate existing notebooks, read notebook contents and summarize what the code does, execute code snippets within the chat"
        suggestions={[
          { text: 'Find my notebooks' },
          { text: 'Summarize this code' },
          { text: 'Execute code snippet' },
          { text: 'Explain this analysis' },
        ]}
      />

      <Dialog open={showScaffoldModal} onOpenChange={setShowScaffoldModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Notebook</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-1.5">Template</Label>
              <select
                className="w-full px-3 py-2 border border-border/60 rounded-md text-sm bg-white"
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
