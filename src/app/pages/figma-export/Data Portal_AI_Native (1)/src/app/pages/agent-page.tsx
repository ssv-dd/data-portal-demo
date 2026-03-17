import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ResultCard } from '../components/result-card';
import { QuerySkeleton } from '../components/query-skeleton';
import { ConfidenceBanner } from '../components/confidence-banner';
import { artifacts, conversations } from '../data/mock-data';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

export function AgentPage() {
  const [messages, setMessages] = useState(conversations);
  const [input, setInput] = useState('');
  const [pinnedCards, setPinnedCards] = useState<string[]>([]);
  const [showSQLModal, setShowSQLModal] = useState(false);
  const [selectedSQL, setSelectedSQL] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user' as const,
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Add assistant response with result cards
      const assistantMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant' as const,
        content: "I found 3 relevant assets that may help explain this:",
        timestamp: new Date().toISOString(),
        resultCards: [artifacts[0], artifacts[1], artifacts[2]],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handlePin = (id: string) => {
    if (!pinnedCards.includes(id)) {
      const newPinned = [...pinnedCards, id];
      setPinnedCards(newPinned);
      
      if (newPinned.length >= 2) {
        toast('2 cards pinned — Open canvas?', {
          action: {
            label: 'Open Canvas',
            onClick: () => {
              sessionStorage.setItem('pinnedCards', JSON.stringify(newPinned));
              navigate('/dashboard/draft');
            },
          },
          duration: 5000,
        });
      } else {
        toast.success(`Card pinned (${newPinned.length})`);
      }
    }
  };

  const handleShowSQL = (artifact: any) => {
    setSelectedSQL(artifact);
    setShowSQLModal(true);
  };

  const handleOpenInStudio = (artifact: any) => {
    sessionStorage.setItem('sqlStudioArtifact', JSON.stringify(artifact));
    navigate('/sql-studio');
  };

  const hasLowConfidence = messages.some(
    (m) => m.resultCards?.some((card) => card.confidence === 'low')
  );

  return (
    <div className="h-full flex flex-col">
      {/* Chat Container */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 1 && !isLoading && (
            <div className="text-center py-12">
              <h2 className="text-2xl text-gray-900 mb-4">Ask the Data Agent</h2>
              <p className="text-gray-600 mb-8">
                {messages[0].content}
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                <button
                  onClick={() => {
                    setInput("Why did completed orders drop in SF on Mar 5?");
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 text-left transition-colors"
                >
                  <p className="text-sm text-gray-900">Why did completed orders drop in SF on Mar 5?</p>
                </button>
                <button
                  onClick={() => {
                    setInput("What's the average delivery time by zone?");
                  }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 text-left transition-colors"
                >
                  <p className="text-sm text-gray-900">What's the average delivery time by zone?</p>
                </button>
                <button
                  onClick={() => {
                    setInput("Show me courier availability trends");
                  }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 text-left transition-colors"
                >
                  <p className="text-sm text-gray-900">Show me courier availability trends</p>
                </button>
                <button
                  onClick={() => {
                    setInput("Compare revenue across regions");
                  }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 text-left transition-colors"
                >
                  <p className="text-sm text-gray-900">Compare revenue across regions</p>
                </button>
              </div>
            </div>
          )}

          {messages.slice(1).map((message) => (
            <div key={message.id}>
              <div
                className={`mb-4 ${
                  message.role === 'user'
                    ? 'ml-auto bg-gray-100 p-4 rounded-lg max-w-2xl'
                    : 'text-gray-700'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="text-gray-900">{message.content}</p>
                ) : (
                  <p className="mb-4">{message.content}</p>
                )}
              </div>

              {/* Result Cards */}
              {message.resultCards && (
                <>
                  {message.resultCards.some((card) => card.confidence === 'low') && (
                    <div className="mb-4">
                      <ConfidenceBanner confidence="low" />
                    </div>
                  )}
                  <div className="space-y-4">
                    {message.resultCards.map((artifact) => (
                      <ResultCard
                        key={artifact.id}
                        artifact={artifact}
                        onPin={handlePin}
                        onShowSQL={handleShowSQL}
                        onOpenInStudio={handleOpenInStudio}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Loading State */}
          {isLoading && <QuerySkeleton />}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <Input
              placeholder="Ask me anything about orders, delivery, couriers or revenue..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-gray-50 border-gray-200"
            />
            <Button
              onClick={handleSend}
              style={{ backgroundColor: '#FF3A00' }}
              className="text-white gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Try: "Why did completed orders drop in SF on Mar 5?"
          </p>
        </div>
      </div>

      {/* SQL Modal */}
      <Dialog open={showSQLModal} onOpenChange={setShowSQLModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedSQL?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              {selectedSQL?.sql}
            </pre>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSQLModal(false)}>
                Close
              </Button>
              <Button
                style={{ backgroundColor: '#FF3A00' }}
                className="text-white"
                onClick={() => {
                  handleOpenInStudio(selectedSQL);
                  setShowSQLModal(false);
                }}
              >
                Open in SQL Studio
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}