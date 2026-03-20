import { useState } from 'react';
import { motion } from 'motion/react';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, Grid2x2, FileText, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { mockCanvases } from '../data/mock/canvas-data';

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
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Grid2x2 className="w-6 h-6 text-dd-primary" />
                <h1 className="text-2xl text-dd-primary">Dashboards</h1>
              </div>
              <p className="text-muted-foreground">
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
                className="pl-10 bg-muted/50 border-border/60"
              />
            </div>
            <Button
              className="bg-dd-primary text-white gap-2"
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
              className={filter === 'all' ? 'bg-muted text-foreground' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={filter === 'mine' ? 'bg-muted text-foreground' : ''}
              onClick={() => setFilter('mine')}
            >
              My Canvases
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={filter === 'shared' ? 'bg-muted text-foreground' : ''}
              onClick={() => setFilter('shared')}
            >
              Shared with me
            </Button>
          </div>

          {filteredCanvases.length > 0 ? (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCanvases.map((canvas) => (
                <motion.div variants={staggerItem} key={canvas.id}>
                  <div
                    className="bg-white border border-border/60 rounded-2xl p-5 hover:shadow-card-hover transition-shadow cursor-pointer"
                    onClick={() => navigate('/dashboard/draft')}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-muted-foreground/60" />
                        <h3 className="font-medium text-foreground">{canvas.title}</h3>
                      </div>
                      {canvas.shared && (
                        <Users className="w-4 h-4 text-muted-foreground/60" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{canvas.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
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
            <div className="text-center py-16 bg-muted/50 rounded-2xl">
              <Grid2x2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/60" />
              <p className="text-muted-foreground mb-4">No canvases found</p>
              <Button
                className="bg-dd-primary text-white gap-2"
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
