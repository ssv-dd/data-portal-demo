import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, Grid2x2, FileText, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';

interface Canvas {
  id: string;
  title: string;
  description: string;
  lastEdited: string;
  metrics: number;
  owner: string;
  shared: boolean;
}

const mockCanvases: Canvas[] = [
  {
    id: '1',
    title: 'Q1 Operations Dashboard',
    description: 'Key operational metrics for Q1 review',
    lastEdited: '2 hours ago',
    metrics: 12,
    owner: 'Tony',
    shared: false,
  },
  {
    id: '2',
    title: 'Delivery Performance',
    description: 'Dasher and delivery latency metrics',
    lastEdited: '1 day ago',
    metrics: 8,
    owner: 'Tony',
    shared: true,
  },
  {
    id: '3',
    title: 'Customer Experience',
    description: 'CX metrics and NPS tracking',
    lastEdited: '3 days ago',
    metrics: 15,
    owner: 'Tony',
    shared: false,
  },
  {
    id: '4',
    title: 'DashPass Growth Tracker',
    description: 'Subscription growth, retention, and churn metrics',
    lastEdited: '5 hours ago',
    metrics: 9,
    owner: 'Tony',
    shared: true,
  },
  {
    id: '5',
    title: 'Marketplace Health',
    description: 'Supply/demand balance, merchant metrics, and order volume',
    lastEdited: '2 days ago',
    metrics: 18,
    owner: 'Tony',
    shared: false,
  },
  {
    id: '6',
    title: 'Weekly Business Review',
    description: 'WBR deck metrics: revenue, orders, new users, CSAT',
    lastEdited: '6 hours ago',
    metrics: 22,
    owner: 'Tony',
    shared: true,
  },
];

export function MyCanvasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all');
  const navigate = useNavigate();

  const filteredCanvases = mockCanvases.filter((canvas) => {
    const matchesSearch = canvas.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      canvas.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'mine') return matchesSearch && !canvas.shared;
    if (filter === 'shared') return matchesSearch && canvas.shared;
    return matchesSearch;
  });

  return (
    <div className="h-full flex overflow-hidden">
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Grid2x2 className="w-6 h-6" style={{ color: '#FF3A00' }} />
              <h1 className="text-2xl" style={{ color: '#FF3A00' }}>Dashboards</h1>
            </div>
            <p className="text-gray-600">
              Create and manage metric dashboards. Open a canvas to edit or start a new one
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search canvases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            <Button
              style={{ backgroundColor: '#FF3A00' }}
              className="text-white gap-2"
              onClick={() => navigate('/dashboard/draft')}
            >
              <Plus className="w-4 h-4" />
              New Canvas
            </Button>
          </div>

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
              My Canvases
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

          {filteredCanvases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCanvases.map((canvas) => (
                <div
                  key={canvas.id}
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate('/dashboard/draft')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <h3 className="font-medium text-gray-900">{canvas.title}</h3>
                    </div>
                    {canvas.shared && (
                      <Users className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{canvas.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{canvas.lastEdited}</span>
                    </div>
                    <span>{canvas.metrics} metrics</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <Grid2x2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">No canvases found</p>
              <Button
                style={{ backgroundColor: '#FF3A00' }}
                className="text-white gap-2"
                onClick={() => navigate('/dashboard/draft')}
              >
                <Plus className="w-4 h-4" />
                Create your first canvas
              </Button>
            </div>
          )}
        </div>
      </div>

      <AIAssistantSidebar title="Dashboard Assistant" />
    </div>
  );
}
