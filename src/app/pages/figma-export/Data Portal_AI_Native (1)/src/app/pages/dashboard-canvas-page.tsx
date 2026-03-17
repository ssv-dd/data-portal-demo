import { useState, useEffect } from 'react';
import { artifacts } from '../data/mock-data';
import { Button } from '../components/ui/button';
import { Share2, Settings, Eye, X } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { VerifiedBadge } from '../components/verified-badge';
import { toast } from 'sonner';

const mockData = [
  { name: 'SF', value: 4000 },
  { name: 'NYC', value: 3000 },
  { name: 'LA', value: 2000 },
  { name: 'Chicago', value: 2780 },
  { name: 'Boston', value: 1890 },
];

const COLORS = ['#FF3A00', '#FF6B3D', '#FF9C7A', '#FFCDB7', '#FFE8DF'];

type ChartType = 'bar' | 'line' | 'pie';

export function DashboardCanvasPage() {
  const [pinnedArtifacts, setPinnedArtifacts] = useState<any[]>([]);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [chartTypes, setChartTypes] = useState<Record<string, ChartType>>({});

  useEffect(() => {
    const pinnedIds = JSON.parse(sessionStorage.getItem('pinnedCards') || '[]');
    const pinned = artifacts.filter((a) => pinnedIds.includes(a.id));
    setPinnedArtifacts(pinned);
    
    // Initialize chart types
    const types: Record<string, ChartType> = {};
    pinned.forEach((a, i) => {
      types[a.id] = i % 2 === 0 ? 'bar' : 'line';
    });
    setChartTypes(types);
  }, []);

  const handlePublish = () => {
    setShowPublishModal(false);
    toast.success('Dashboard published. Share link copied.', {
      duration: 3000,
    });
  };

  const renderChart = (artifactId: string) => {
    const chartType = chartTypes[artifactId] || 'bar';

    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#FF3A00" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#FF3A00" strokeWidth={2} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={mockData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => entry.name}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl text-gray-900">Draft Dashboard</h1>
            <p className="text-sm text-gray-600">Auto-generated from pinned cards</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button
              style={{ backgroundColor: '#FF3A00' }}
              className="text-white gap-2"
              onClick={() => setShowPublishModal(true)}
            >
              <Share2 className="w-4 h-4" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {pinnedArtifacts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">No cards pinned yet.</p>
              <Button
                style={{ backgroundColor: '#FF3A00' }}
                className="text-white"
                onClick={() => window.location.href = '/agent'}
              >
                Go to Agent
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {pinnedArtifacts.map((artifact) => (
                <div key={artifact.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg text-gray-900 mb-1">{artifact.title}</h3>
                      <p className="text-sm text-gray-600">{artifact.description}</p>
                    </div>
                    <VerifiedBadge
                      verified={artifact.verified}
                      verifiedBy={artifact.verifiedBy}
                      verifiedDate={artifact.verifiedDate}
                    />
                  </div>

                  {/* Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      {renderChart(artifact.id)}
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Publish Modal */}
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Publish dashboard to Organization?</DialogTitle>
            <DialogDescription>
              Verified metrics will power automated narrative summaries. Unverified assets will publish as draft-only and will not be used for org-wide AI summaries. To include unverified metrics in org summaries, request verification.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              {pinnedArtifacts.map((artifact) => (
                <div key={artifact.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <span className="text-sm text-gray-900">{artifact.title}</span>
                  <VerifiedBadge
                    verified={artifact.verified}
                    verifiedBy={artifact.verifiedBy}
                    verifiedDate={artifact.verifiedDate}
                  />
                </div>
              ))}
            </div>

            {pinnedArtifacts.some((a) => !a.verified) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ This dashboard contains unverified metrics. They will not be included in organizational AI summaries.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPublishModal(false)}>
                Save as Draft
              </Button>
              <Button
                style={{ backgroundColor: '#FF3A00' }}
                className="text-white"
                onClick={handlePublish}
              >
                Publish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}