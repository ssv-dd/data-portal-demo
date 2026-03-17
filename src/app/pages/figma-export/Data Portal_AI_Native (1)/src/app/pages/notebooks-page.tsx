import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Plus, BookOpen, Code, BarChart, Search, FileText, Clock, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { artifacts } from '../data/mock-data';
import { DashboardCard } from '../components/dashboard-card';
import { toast } from 'sonner';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';

const notebookTemplates = [
  {
    id: 'template_1',
    name: 'Feature Exploration',
    description: 'Explore feature distributions, correlations, and quality metrics',
    icon: BarChart,
  },
  {
    id: 'template_2',
    name: 'Model Evaluation',
    description: 'Evaluate model performance with standard ML metrics',
    icon: Code,
  },
  {
    id: 'template_3',
    name: 'Data Quality Check',
    description: 'Run data quality checks and generate reports',
    icon: BookOpen,
  },
];

interface Notebook {
  id: string;
  title: string;
  description: string;
  lastEdited: string;
  owner: string;
  shared: boolean;
}

const mockNotebooks: Notebook[] = [
  {
    id: '1',
    title: 'Q1 Operations Dashboard',
    description: 'Key operational metrics for Q1 review',
    lastEdited: '2 hours ago',
    owner: 'Tony',
    shared: false,
  },
  {
    id: '2',
    title: 'Delivery Performance',
    description: 'Dasher and delivery latency metrics',
    lastEdited: '1 day ago',
    owner: 'Tony',
    shared: true,
  },
  {
    id: '3',
    title: 'Customer Experience',
    description: 'CX metrics and NPS tracking',
    lastEdited: '3 days ago',
    owner: 'Tony',
    shared: false,
  },
];

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

  const notebookArtifacts = artifacts.filter((a) => a.type === 'notebook');

  const handleCreateNotebook = () => {
    toast.success('Notebook created successfully');
    setShowScaffoldModal(false);
    setSelectedTemplate(null);
    setNotebookName('');
    setNotebookOwner('');
  };

  return (
    <div className="h-full flex overflow-hidden">
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl text-gray-900 mb-2">Notebooks</h1>
            <p className="text-gray-600">
              Clone existing notebooks or create new ones from templates
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search notebooks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            <Button
              style={{ backgroundColor: '#FF3A00' }}
              className="text-white gap-2"
              onClick={() => setShowScaffoldModal(true)}
            >
              <Plus className="w-4 h-4" />
              New Notebook
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              className={filter === 'all' ? 'bg-gray-100 text-gray-900' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={filter === 'mine' ? 'bg-gray-100 text-gray-900' : ''}
              onClick={() => setFilter('mine')}
            >
              My Notebooks
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={filter === 'shared' ? 'bg-gray-100 text-gray-900' : ''}
              onClick={() => setFilter('shared')}
            >
              Shared with me
            </Button>
          </div>

          {/* Notebooks Grid */}
          {filteredNotebooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredNotebooks.map((notebook) => (
                <div
                  key={notebook.id}
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <h3 className="font-medium text-gray-900">{notebook.title}</h3>
                    </div>
                    {notebook.shared && (
                      <Users className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{notebook.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{notebook.lastEdited}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg mb-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">No notebooks found</p>
              <Button
                style={{ backgroundColor: '#FF3A00' }}
                className="text-white gap-2"
                onClick={() => setShowScaffoldModal(true)}
              >
                <Plus className="w-4 h-4" />
                Create your first notebook
              </Button>
            </div>
          )}

          {/* Templates */}
          <div>
            <h2 className="text-lg text-gray-900 mb-4">Get Started with Notebook Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notebookTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setShowScaffoldModal(true);
                  }}
                >
                  <template.icon className="w-8 h-8 text-gray-600 mb-3" />
                  <h3 className="text-base text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - AI Assistant */}
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

      {/* Scaffold Modal */}
      <Dialog open={showScaffoldModal} onOpenChange={setShowScaffoldModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Notebook</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Template</Label>
              <select
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md"
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
              <Label>Notebook Name</Label>
              <Input
                placeholder="e.g., Q1 Revenue Analysis"
                value={notebookName}
                onChange={(e) => setNotebookName(e.target.value)}
              />
            </div>

            <div>
              <Label>Owner</Label>
              <Input
                placeholder="e.g., J. Smith"
                value={notebookOwner}
                onChange={(e) => setNotebookOwner(e.target.value)}
              />
            </div>

            {selectedTemplate && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700">
                  This template includes pre-configured cells for data loading, exploration, and visualization.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowScaffoldModal(false)}>
                Cancel
              </Button>
              <Button
                style={{ backgroundColor: '#FF3A00' }}
                className="text-white"
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