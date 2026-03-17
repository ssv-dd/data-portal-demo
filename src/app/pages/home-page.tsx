import { useState } from 'react';
import { DashboardCard } from '../components/dashboard-card';
import { artifacts } from '../data/mock-data';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Sparkles, MessageSquare, Layers, BookOpen, Send, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisResponse } from '../components/analysis-response';

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState('I want to run a deep-dive analysis on Dashpass growth for the past 60 days.');
  const [activeFilter, setActiveFilter] = useState<'all' | 'my-work' | 'shared'>('all');
  const [agentMode, setAgentMode] = useState<'chat' | 'hybrid' | 'notebook'>('chat');
  const [agentPurpose, setAgentPurpose] = useState<'analysis' | 'exploration' | 'reporting'>('analysis');
  const [isChatCentered, setIsChatCentered] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasMessages = messages.length > 0;
  const filteredArtifacts = artifacts;

  const handleAgentSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      submitPrompt();
    }
  };

  const submitPrompt = () => {
    if (!searchTerm.trim()) return;

    if (!isChatCentered) {
      setIsChatCentered(true);
    }

    const userMessage = searchTerm;
    setMessages([{ role: 'user', content: userMessage }]);
    setIsLoading(true);
    setSearchTerm('');

    setTimeout(() => {
      setMessages([
        { role: 'user', content: userMessage },
        { role: 'assistant', content: 'analysis' }
      ]);
      setIsLoading(false);
    }, 2000);
  };

  const handleChatClick = () => {
    setIsChatCentered(true);
  };

  const handleBackClick = () => {
    setIsChatCentered(false);
    setMessages([]);
    setSearchTerm('I want to run a deep-dive analysis on Dashpass growth for the past 60 days.');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="h-full bg-white overflow-hidden relative flex flex-col">
      {/* Discovery Section */}
      <motion.div
        animate={{ y: isChatCentered ? '100%' : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="p-8 flex-1 overflow-auto"
      >
        <div className="max-w-7xl mx-auto">
          <div style={{ height: '32px', marginBottom: '24px' }} />
          <div style={{ height: '140px', marginBottom: '32px' }} />

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg text-gray-900">Discovery</h2>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              className={activeFilter === 'all' ? 'bg-gray-100 text-gray-900' : ''}
              onClick={() => setActiveFilter('all')}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={activeFilter === 'my-work' ? 'bg-gray-100 text-gray-900' : ''}
              onClick={() => setActiveFilter('my-work')}
            >
              My Work
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={activeFilter === 'shared' ? 'bg-gray-100 text-gray-900' : ''}
              onClick={() => setActiveFilter('shared')}
            >
              Shared
            </Button>
            <Button variant="outline" size="sm">SQL</Button>
            <Button variant="outline" size="sm">Dashboards</Button>
            <Button variant="outline" size="sm">Notebooks</Button>
          </div>

          {filteredArtifacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtifacts.map((artifact) => (
                <DashboardCard key={artifact.id} artifact={artifact} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">
                No recent artifacts. Try searching for 'delivery latency' or ask the Data Agent to surface related work.
              </p>
              <Button style={{ backgroundColor: '#FF3A00' }} className="text-white">
                Ask Data Agent
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Chat Interface — full screen mode */}
      {isChatCentered && hasMessages ? (
        <div className="absolute inset-0 bg-white flex flex-col">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={handleBackClick}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Back to Home</span>
              </button>
              <h1 className="text-2xl text-gray-900">{getGreeting()}, Tony</h1>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-8 py-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <div key={index}>
                  {message.role === 'user' && (
                    <div className="flex justify-end mb-6">
                      <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-3xl">
                        <p className="text-gray-900">{message.content}</p>
                      </div>
                    </div>
                  )}
                  {message.role === 'assistant' && message.content === 'analysis' && (
                    <AnalysisResponse />
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF3A00' }}>
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-50 rounded-lg px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 bg-white px-8 py-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="relative mb-4">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#FF3A00' }} />
                  <Input
                    placeholder="Prompt to explore your data"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleAgentSearch}
                    className="pl-12 h-12 text-base border-gray-300"
                  />
                  <Send
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer"
                    style={{ color: '#FF3A00' }}
                    onClick={submitPrompt}
                  />
                </div>

                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setAgentMode('chat')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      agentMode === 'chat' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" /> Chat
                  </button>
                  <button
                    onClick={() => setAgentMode('hybrid')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      agentMode === 'hybrid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Layers className="w-4 h-4" /> Hybrid
                  </button>
                  <button
                    onClick={() => setAgentMode('notebook')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      agentMode === 'notebook' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" /> Notebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Floating Chat Container (initial state) */
        <div className="absolute left-0 right-0 pointer-events-none px-8" style={{ top: '32px' }}>
          <motion.div
            animate={{ y: isChatCentered && !hasMessages ? 'calc(50vh - 200px)' : 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="pointer-events-auto max-w-7xl mx-auto"
          >
            <AnimatePresence>
              {isChatCentered && !hasMessages && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleBackClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">Back to Home</span>
                </motion.button>
              )}
            </AnimatePresence>

            <motion.h1
              animate={{
                fontSize: isChatCentered ? '30px' : '24px',
                marginBottom: isChatCentered ? '32px' : '24px',
              }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="text-gray-900"
            >
              {getGreeting()}, Tony
            </motion.h1>

            <div
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 transition-shadow hover:shadow-md"
              onClick={!isChatCentered ? handleChatClick : undefined}
              style={{ cursor: isChatCentered ? 'default' : 'pointer' }}
            >
              <div className="relative mb-4">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#FF3A00' }} />
                <Input
                  placeholder="Prompt to explore your data"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleAgentSearch}
                  onClick={handleChatClick}
                  className="pl-12 h-12 text-base border-gray-300"
                />
                <Send
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer"
                  style={{ color: '#FF3A00' }}
                  onClick={submitPrompt}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={(e) => { e.stopPropagation(); setAgentMode('chat'); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      agentMode === 'chat' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" /> Chat
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setAgentMode('hybrid'); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      agentMode === 'hybrid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Layers className="w-4 h-4" /> Hybrid
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setAgentMode('notebook'); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      agentMode === 'notebook' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" /> Notebook
                  </button>
                </div>

                <motion.div
                  animate={{ opacity: isChatCentered ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ pointerEvents: isChatCentered ? 'none' : 'auto' }}
                  className="flex items-center gap-2"
                >
                  {(['analysis', 'exploration', 'reporting'] as const).map((purpose) => (
                    <button
                      key={purpose}
                      onClick={(e) => { e.stopPropagation(); setAgentPurpose(purpose); }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors capitalize ${
                        agentPurpose === purpose
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {purpose}
                    </button>
                  ))}
                </motion.div>
              </div>
            </div>

            <AnimatePresence>
              {isChatCentered && !hasMessages && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mt-8 text-center text-gray-500 text-sm"
                >
                  Start typing to explore your data with AI
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
}
