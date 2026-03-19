import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sparkles, MessageSquare, Layers, BookOpen, Send, ChevronLeft, Star, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisResponse } from '../components/analysis-response';
import { ExecutiveScorecard } from '../components/ExecutiveScorecard';
import { goldenDashboards } from '../data/mock-data';
import { recommendations, favoriteAssets } from '../data/mock/home-data';
import { chartData, summaryData } from '../data/mock/analysis-data';
import { appConfig } from '@/config/app.config';
import companyDashboardPreview from '../../assets/company-dashboard-preview.png';
import progressVsPlanPreview from '../../assets/progress-vs-plan-preview.png';

const ease = [0.4, 0, 0.2, 1] as const;

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState('I want to run a deep-dive analysis on Dashpass growth for the past 60 days.');
  const [agentMode, setAgentMode] = useState<'chat' | 'hybrid' | 'notebook'>('chat');
  const [agentPurpose, setAgentPurpose] = useState<'analysis' | 'exploration' | 'reporting'>('analysis');
  const [isChatCentered, setIsChatCentered] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickAccessTab, setQuickAccessTab] = useState<'recent' | 'favorites'>('recent');
  const [hoveredRecommendation, setHoveredRecommendation] = useState<string | null>(null);

  const hasMessages = messages.length > 0;

  const handleAgentSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) submitPrompt();
  };

  const submitPrompt = () => {
    if (!searchTerm.trim()) return;
    if (!isChatCentered) setIsChatCentered(true);
    const userMessage = searchTerm;
    setMessages([{ role: 'user', content: userMessage }]);
    setIsLoading(true);
    setSearchTerm('');
    setTimeout(() => {
      setMessages([
        { role: 'user', content: userMessage },
        { role: 'assistant', content: 'analysis' },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  const handleChatClick = () => setIsChatCentered(true);

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

  const chatBox = (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 transition-shadow hover:shadow-md"
      onClick={!isChatCentered ? handleChatClick : undefined}
      style={{ cursor: isChatCentered ? 'default' : 'pointer' }}
    >
      <div className="relative mb-4">
        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dd-primary" />
        <Input
          placeholder="Prompt to explore your data"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleAgentSearch}
          onClick={!isChatCentered ? handleChatClick : undefined}
          className="pl-12 h-12 text-base border-gray-300"
        />
        <Send
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-dd-primary"
          onClick={(e) => { e.stopPropagation(); submitPrompt(); }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {(['chat', 'hybrid', 'notebook'] as const).map((mode) => (
            <button
              key={mode}
              onClick={(e) => { e.stopPropagation(); setAgentMode(mode); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                agentMode === mode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {mode === 'chat' && <MessageSquare className="w-4 h-4" />}
              {mode === 'hybrid' && <Layers className="w-4 h-4" />}
              {mode === 'notebook' && <BookOpen className="w-4 h-4" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
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
  );

  return (
    <div className="h-full bg-white overflow-hidden relative flex flex-col">
      {/*
        Single scrollable container — the chat box is always the SAME element.
        When isChatCentered: content above/below collapses & fades, a spacer
        pushes the chat box to vertical center, so it *moves* there naturally.
      */}
      <div
        className="flex-1 overflow-auto"
        style={{ display: hasMessages && isChatCentered ? 'none' : undefined }}
      >
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Back button — appears when centered */}
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

            {/* Greeting */}
            <motion.h1
              animate={{
                fontSize: isChatCentered ? '30px' : '24px',
                marginBottom: isChatCentered ? '32px' : '24px',
              }}
              transition={{ duration: 0.5, ease }}
              className="text-gray-900"
            >
              {getGreeting()}, {appConfig.user.name}
            </motion.h1>

            {/* Spacer — grows to push chat box to ~center when in chat mode */}
            <motion.div
              animate={{ height: isChatCentered && !hasMessages ? 'calc(40vh - 160px)' : 0 }}
              transition={{ duration: 0.5, ease }}
            />

            {/* THE chat box — same element, same DOM position always */}
            <motion.div
              layout
              transition={{ duration: 0.5, ease }}
              className="mb-8"
            >
              {chatBox}
            </motion.div>

            {/* Helper text — only when centered */}
            <AnimatePresence>
              {isChatCentered && !hasMessages && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-center text-gray-500 text-sm -mt-4 mb-8"
                >
                  Start typing to explore your data with AI
                </motion.p>
              )}
            </AnimatePresence>

            {/* Discover content — collapses & fades when chat is centered */}
            <motion.div
              animate={{
                opacity: isChatCentered ? 0 : 1,
                height: isChatCentered ? 0 : 'auto',
              }}
              transition={{ duration: 0.4, ease }}
              style={{ overflow: 'hidden', pointerEvents: isChatCentered ? 'none' : 'auto' }}
            >
              <div className="mb-4">
                <h2 className="text-lg text-gray-900">Discover</h2>
                <p className="text-sm text-gray-500 mt-1">Curated insights, trends, and dashboards relevant to you</p>
              </div>

              <div className="mb-8">
                <ExecutiveScorecard
                  userRole="business-executive"
                  onOpenChat={(query) => {
                    setSearchTerm(query);
                    setIsChatCentered(true);
                  }}
                />
              </div>

              {/* Recommendations */}
              <div className="mb-8">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Recommended for You
                </h2>
                <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="relative">
                      <Card
                        className="p-5 hover:shadow-md transition-all cursor-pointer border-purple-200 bg-purple-50/30 h-full"
                        onClick={() => {
                          if (rec.id === 'rec-1') window.open(appConfig.externalUrls.companyDashboard, '_blank');
                          else if (rec.id === 'rec-2') window.open(appConfig.externalUrls.progressVsPlan, '_blank');
                        }}
                        onMouseEnter={() => setHoveredRecommendation(rec.id)}
                        onMouseLeave={() => setHoveredRecommendation(null)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 line-clamp-1">{rec.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{rec.reason}</p>
                          </div>
                          <Badge variant="outline" className="text-xs ml-2 shrink-0">{rec.type}</Badge>
                        </div>
                      </Card>
                      {hoveredRecommendation === rec.id && rec.id === 'rec-1' && (
                        <div className="absolute top-full left-0 mt-2 z-50 w-full pointer-events-none">
                          <Card className="p-4 shadow-2xl border-2 border-purple-400 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="mb-3">
                              <p className="text-sm font-semibold text-purple-600">Dashboard Preview</p>
                              <p className="text-xs text-gray-500 mt-0.5">{rec.title}</p>
                            </div>
                            <div className="rounded-lg overflow-hidden border-2 border-purple-100 shadow-lg">
                              <img src={companyDashboardPreview} alt="Company Dashboard Preview" className="w-full" />
                            </div>
                          </Card>
                        </div>
                      )}
                      {hoveredRecommendation === rec.id && rec.id === 'rec-2' && (
                        <div className="absolute top-full left-0 mt-2 z-50 w-full pointer-events-none">
                          <Card className="p-4 shadow-2xl border-2 border-purple-400 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="mb-3">
                              <p className="text-sm font-semibold text-purple-600">Dashboard Preview</p>
                              <p className="text-xs text-gray-500 mt-0.5">{rec.title}</p>
                            </div>
                            <div className="rounded-lg overflow-hidden border-2 border-purple-100 shadow-lg">
                              <img src={progressVsPlanPreview} alt="Progress vs Plan Preview" className="w-full" />
                            </div>
                          </Card>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Access */}
              <div className="mb-8">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  Quick Access
                </h2>
                <div className="flex gap-2 mb-4 border-b">
                  <button
                    onClick={() => setQuickAccessTab('recent')}
                    className={`pb-2 px-3 text-sm font-medium border-b-2 transition-colors ${quickAccessTab === 'recent' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                  >
                    <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Recently Viewed</div>
                  </button>
                  <button
                    onClick={() => setQuickAccessTab('favorites')}
                    className={`pb-2 px-3 text-sm font-medium border-b-2 transition-colors ${quickAccessTab === 'favorites' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                  >
                    <div className="flex items-center gap-1.5"><Star className="h-4 w-4" /> Favorites</div>
                  </button>
                </div>
                <div className="space-y-2">
                  {quickAccessTab === 'recent' ? (
                    goldenDashboards['business-executive'].map((dashboard) => (
                      <Card key={dashboard.id} className="p-4 hover:shadow-md transition-all cursor-pointer hover:border-yellow-500/50"
                        onClick={() => { if (dashboard.id === 'gd-be-4') window.open(appConfig.externalUrls.cpdProjector, '_blank'); }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl">{dashboard.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{dashboard.title}</div>
                              <div className="text-xs text-gray-500">{dashboard.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">Dashboard</Badge>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    favoriteAssets.map((asset) => (
                      <Card key={asset.id} className="p-4 hover:shadow-md transition-all cursor-pointer hover:border-yellow-500/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center text-2xl">{asset.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{asset.name}</div>
                              <div className="text-xs text-gray-500">{asset.type}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">{asset.type}</Badge>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Messages view (chat box at bottom) ── */}
      <AnimatePresence>
        {isChatCentered && hasMessages && (
          <motion.div
            key="chat-messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 bg-white flex flex-col"
          >
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="max-w-7xl mx-auto">
                <button onClick={handleBackClick} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">Back to Home</span>
                </button>
                <h1 className="text-2xl text-gray-900">{getGreeting()}, {appConfig.user.name}</h1>
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
                    {message.role === 'assistant' && message.content === 'analysis' && <AnalysisResponse chartData={chartData} summaryData={summaryData} />}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-dd-primary">
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

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease }}
              className="border-t border-gray-200 bg-white px-8 py-4"
            >
              <div className="max-w-7xl mx-auto">
                {chatBox}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
