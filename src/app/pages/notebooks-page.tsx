import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Plus, BookOpen, Code, BarChart3, Search, FileText, Clock, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';

const notebookTemplates = [
  {
    id: 'template_1',
    name: 'Feature Exploration',
    description: 'Explore feature distributions, correlations, and quality metrics',
    icon: BarChart3,
    cells: 8,
  },
  {
    id: 'template_2',
    name: 'Model Evaluation',
    description: 'Evaluate model performance with standard ML metrics',
    icon: Code,
    cells: 12,
  },
  {
    id: 'template_3',
    name: 'Data Quality Check',
    description: 'Run data quality checks and generate reports',
    icon: BookOpen,
    cells: 6,
  },
];

interface Notebook {
  id: string;
  title: string;
  description: string;
  lastEdited: string;
  owner: string;
  shared: boolean;
  cells: number;
  language: string;
}

const mockNotebooks: Notebook[] = [
  { id: '1', title: 'Courier Availability Analysis', description: 'Feature exploration & distribution for courier supply model', lastEdited: '2 hours ago', owner: 'S. Lee', shared: false, cells: 14, language: 'Python' },
  { id: '2', title: 'DashPass Retention Deep-Dive', description: 'Cohort analysis of DashPass subscriber retention', lastEdited: '5 hours ago', owner: 'Tony', shared: true, cells: 18, language: 'Python' },
  { id: '3', title: 'Merchant GMV Forecasting', description: 'Time-series forecasting for merchant gross merchandise value', lastEdited: '1 day ago', owner: 'A. Patel', shared: true, cells: 22, language: 'Python' },
  { id: '4', title: 'Delivery Time Optimization', description: 'Analysis of delivery time factors and bottlenecks', lastEdited: '2 days ago', owner: 'Tony', shared: false, cells: 16, language: 'Python' },
  { id: '5', title: 'New User Funnel Analysis', description: 'Conversion funnel from signup to first order', lastEdited: '3 days ago', owner: 'M. Chen', shared: true, cells: 10, language: 'SQL + Python' },
  { id: '6', title: 'Ad Attribution Model', description: 'Multi-touch attribution for marketing campaigns', lastEdited: '4 days ago', owner: 'Tony', shared: false, cells: 20, language: 'Python' },
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
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-6 h-6" style={{ color: '#FF3A00' }} />
              <h1 className="text-2xl" style={{ color: '#FF3A00' }}>Notebooks</h1>
            </div>
            <p className="text-gray-600">
              Clone existing notebooks or create new ones from templates
            </p>
          </div>

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

          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="sm" className={filter === 'all' ? 'bg-gray-100 text-gray-900' : ''} onClick={() => setFilter('all')}>All</Button>
            <Button variant="outline" size="sm" className={filter === 'mine' ? 'bg-gray-100 text-gray-900' : ''} onClick={() => setFilter('mine')}>My Notebooks</Button>
            <Button variant="outline" size="sm" className={filter === 'shared' ? 'bg-gray-100 text-gray-900' : ''} onClick={() => setFilter('shared')}>Shared with me</Button>
          </div>

          {filteredNotebooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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
                    {notebook.shared && <Users className="w-4 h-4 text-gray-400" />}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{notebook.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{notebook.lastEdited}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{notebook.cells} cells</span>
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{notebook.language}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg mb-10">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">No notebooks found</p>
              <Button style={{ backgroundColor: '#FF3A00' }} className="text-white gap-2" onClick={() => setShowScaffoldModal(true)}>
                <Plus className="w-4 h-4" />
                Create your first notebook
              </Button>
            </div>
          )}

          <div>
            <h2 className="text-lg text-gray-900 mb-4">Get Started with Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notebookTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setShowScaffoldModal(true);
                  }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#FFF0EB' }}>
                    <template.icon className="w-5 h-5" style={{ color: '#FF3A00' }} />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <span className="text-xs text-gray-400">{template.cells} pre-configured cells</span>
                </div>
              ))}
            </div>
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
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-white"
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
