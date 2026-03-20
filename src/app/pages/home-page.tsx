import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { GradientOrb } from '../components/hero/gradient-orb';
import { HeroPanel } from '../components/hero/hero-panel';
import { RecentWorkCard, type RecentWorkItem } from '../components/home/recent-work-card';
import { DiscoveryCard } from '../components/home/discovery-card';
import { CreateCard } from '../components/home/create-card';
import { ExecutiveScorecard } from '../components/ExecutiveScorecard';
import { AnalysisResponse } from '../components/analysis-response';
import { Input } from '../components/ui/input';
import { MessageSquare, Layers, BookOpen, Send } from 'lucide-react';
import { appConfig } from '@/config/app.config';
import { discoveryFeed, createActions } from '../data/mock/home-data';
import { recentWork } from '../data/mock/recent-work-data';
import { quickPrompts } from '../data/mock/quick-prompts-data';
import { chartData, summaryData } from '../data/mock/analysis-data';

const ease = [0.4, 0, 0.2, 1] as const;

export function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [agentMode, setAgentMode] = useState<'chat' | 'hybrid' | 'notebook'>('chat');
  const [agentPurpose, setAgentPurpose] = useState<'analysis' | 'exploration' | 'reporting'>('analysis');
  const [isChatCentered, setIsChatCentered] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasMessages = messages.length > 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handlePromptClick = (prompt: string) => {
    setSearchTerm(prompt);
    setIsChatCentered(true);
    setTimeout(() => submitPrompt(prompt), 100);
  };

  const handleHeroSearch = (query: string) => {
    setSearchTerm(query);
    setIsChatCentered(true);
    setTimeout(() => submitPrompt(query), 100);
  };

  const submitPrompt = (customPrompt?: string) => {
    const userMessage = customPrompt || searchTerm;
    if (!userMessage.trim()) return;
    if (!isChatCentered) setIsChatCentered(true);
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

  const handleAgentSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) submitPrompt();
  };

  const handleBackClick = () => {
    setIsChatCentered(false);
    setMessages([]);
    setSearchTerm('');
  };

  const handleRecentWorkClick = (item: RecentWorkItem) => {
    navigate(item.route);
  };

  const handleCreateAction = (action: typeof createActions[0]) => {
    if (action.route) {
      navigate(action.route);
    }
  };

  const handleDiscoveryItemClick = (item: typeof discoveryFeed.recommendations[0]) => {
    if (item.route) {
      navigate(item.route);
    }
  };

  const chatBox = (
    <div
      className="glass-panel border border-border/60 rounded-2xl p-6 transition-shadow hover:shadow-card-hover"
      onClick={!isChatCentered ? () => setIsChatCentered(true) : undefined}
      style={{ cursor: isChatCentered ? 'default' : 'pointer' }}
    >
      <div className="relative mb-4">
        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dd-primary" />
        <Input
          placeholder="Prompt to explore your data"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleAgentSearch}
          onClick={!isChatCentered ? () => setIsChatCentered(true) : undefined}
          className="pl-12 h-12 text-base border-border"
        />
        <Send
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-dd-primary"
          onClick={(e) => { e.stopPropagation(); submitPrompt(); }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl">
          {(['chat', 'hybrid', 'notebook'] as const).map((mode) => (
            <button
              key={mode}
              onClick={(e) => { e.stopPropagation(); setAgentMode(mode); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                agentMode === mode ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
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
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border-border hover:bg-accent/40'
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
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_30%)]" />

      {/* Gradient Orbs - Theme-aware background decoration */}
      <GradientOrb variant="primary" className="left-[-120px] top-[-20px]" />
      <GradientOrb variant="secondary" className="right-[-80px] top-[120px]" />
      <GradientOrb variant="primary" className="left-[60%] top-[600px]" />

      <div
        className="relative z-10"
        style={{ display: hasMessages && isChatCentered ? 'none' : undefined }}
      >
        <div className="overflow-auto h-screen">
          <div className="max-w-[1600px] mx-auto p-8">
            {/* Back button — appears when centered */}
            <AnimatePresence>
              {isChatCentered && !hasMessages && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleBackClick}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">Back to Home</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Spacer — grows to push content to center when in chat mode */}
            <motion.div
              animate={{ height: isChatCentered && !hasMessages ? 'calc(20vh)' : 0 }}
              transition={{ duration: 0.5, ease }}
            />

            {/* Main content - collapses when chat is centered */}
            <motion.div
              animate={{
                opacity: isChatCentered ? 0 : 1,
                height: isChatCentered ? 0 : 'auto',
              }}
              transition={{ duration: 0.4, ease }}
              style={{ overflow: 'hidden', pointerEvents: isChatCentered ? 'none' : 'auto' }}
            >
              {/* Row 1: Hero Panel + Create Card */}
              <div className="grid xl:grid-cols-[1.4fr_0.6fr] gap-5 mb-5">
                <HeroPanel
                  userName={appConfig.user.name}
                  greeting={getGreeting()}
                  prompts={quickPrompts}
                  onPromptClick={handlePromptClick}
                  onSearch={handleHeroSearch}
                />
                <CreateCard actions={createActions} onActionClick={handleCreateAction} />
              </div>

              {/* Row 2: Recent Work + Discovery */}
              <div className="grid xl:grid-cols-[0.84fr_1.16fr] gap-5 mb-5">
                <RecentWorkCard items={recentWork} onItemClick={handleRecentWorkClick} />
                <DiscoveryCard
                  {...discoveryFeed}
                  onItemClick={handleDiscoveryItemClick}
                />
              </div>

              {/* Executive Scorecard - PRESERVED */}
              <div className="mt-8">
                <ExecutiveScorecard
                  userRole={appConfig.user.role}
                  onOpenChat={(query) => {
                    setSearchTerm(query);
                    setIsChatCentered(true);
                    setTimeout(() => submitPrompt(query), 100);
                  }}
                />
              </div>
            </motion.div>

            {/* Chat box when centered without messages */}
            <AnimatePresence>
              {isChatCentered && !hasMessages && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  {chatBox}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="text-center text-muted-foreground text-sm mt-4"
                  >
                    Start typing to explore your data with AI
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Messages view - chat box at bottom */}
      <AnimatePresence>
        {isChatCentered && hasMessages && (
          <motion.div
            key="chat-messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 bg-background flex flex-col"
          >
            <div className="px-8 py-6 border-b border-border/60">
              <div className="max-w-7xl mx-auto">
                <button onClick={handleBackClick} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">Back to Home</span>
                </button>
                <h1 className="text-2xl text-foreground">{getGreeting()}, {appConfig.user.name}</h1>
              </div>
            </div>

            <div className="flex-1 overflow-auto px-8 py-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {messages.map((message, index) => (
                  <div key={index}>
                    {message.role === 'user' && (
                      <div className="flex justify-end mb-6">
                        <div className="bg-muted rounded-lg px-4 py-3 max-w-3xl">
                          <p className="text-foreground">{message.content}</p>
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
                      <div className="bg-muted/50 rounded-lg px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
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
              className="border-t border-border/60 bg-background px-8 py-4"
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
