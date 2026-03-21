import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronLeft, Send, MessageSquare, Layers, BookOpen } from 'lucide-react';
import { GradientOrb } from '../components/hero/gradient-orb';
import { HeroPanel } from '../components/hero/hero-panel';
import { YourWorkCard, type RecentWorkItem, type QuickAction } from '../components/home/your-work-card';
import { DiscoveryCard } from '../components/home/discovery-card';
import { WatchlistTeaser } from '../components/home/watchlist-teaser';
import { productAreaWatchlists, defaultExecAreas } from '../data/mock/watchlist-data';
import { AnalysisResponse } from '../components/analysis-response';
import { Input } from '../components/ui/input';
import { appConfig } from '@/config/app.config';
import { discoveryFeed, quickActions } from '../data/mock/home-data';
import { recentWork } from '../data/mock/recent-work-data';
import { quickPrompts } from '../data/mock/quick-prompts-data';
import { chartData, summaryData } from '../data/mock/analysis-data';

const ease = [0.4, 0, 0.2, 1] as const;

const EXAMPLE_PROMPT = 'I want to run a deep-dive analysis on Dashpass growth for the past 60 days.';

export function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(EXAMPLE_PROMPT);
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

  const handleBackClick = () => {
    setIsChatCentered(false);
    setMessages([]);
    setSearchTerm(EXAMPLE_PROMPT);
  };

  const handleRecentWorkClick = (item: RecentWorkItem) => {
    navigate(item.route);
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.route) {
      navigate(action.route);
    }
  };

  const handleDiscoveryItemClick = (item: typeof discoveryFeed.team[0]) => {
    if (item.route) {
      navigate(item.route);
    }
  };

  const chatBox = (
    <div className="glass-panel border border-border/60 rounded-2xl p-6 transition-shadow hover:shadow-card-hover">
      <div className="relative mb-4">
        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-600 dark:text-violet-400" />
        <Input
          placeholder="Prompt to explore your data"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && searchTerm.trim()) submitPrompt(); }}
          className="pl-12 h-12 text-base border-border"
        />
        <Send
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
          onClick={() => submitPrompt()}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl">
          {(['chat', 'hybrid', 'notebook'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setAgentMode(mode)}
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

        <div className="flex items-center gap-2">
          {(['analysis', 'exploration', 'reporting'] as const).map((purpose) => (
            <button
              key={purpose}
              onClick={() => setAgentPurpose(purpose)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors capitalize ${
                agentPurpose === purpose
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border-border hover:bg-accent/40'
              }`}
            >
              {purpose}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_30%)]" />

      <GradientOrb variant="primary" className="left-[-120px] top-[-20px]" />
      <GradientOrb variant="secondary" className="right-[-80px] top-[120px]" />
      <GradientOrb variant="primary" className="left-[60%] top-[600px]" />

      <div
        className="relative z-10"
        style={{ display: hasMessages && isChatCentered ? 'none' : undefined }}
      >
        <div className="overflow-auto h-screen">
          <div className="max-w-[1600px] mx-auto p-8">
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

            <motion.div
              animate={{ height: isChatCentered && !hasMessages ? 'calc(20vh)' : 0 }}
              transition={{ duration: 0.5, ease }}
            />

            <motion.div
              animate={{
                opacity: isChatCentered ? 0 : 1,
                height: isChatCentered ? 0 : 'auto',
              }}
              transition={{ duration: 0.4, ease }}
              style={{ overflow: 'hidden', pointerEvents: isChatCentered ? 'none' : 'auto' }}
            >
              {/* Row 1: AI Hero — Full Width */}
              <div className="mb-5">
                <HeroPanel
                  userName={appConfig.user.name}
                  greeting={getGreeting()}
                  prompts={quickPrompts}
                  searchTerm={searchTerm}
                  onSearchTermChange={setSearchTerm}
                  onSubmit={() => submitPrompt()}
                  onPromptClick={handlePromptClick}
                  agentMode={agentMode}
                  onAgentModeChange={setAgentMode}
                  agentPurpose={agentPurpose}
                  onAgentPurposeChange={setAgentPurpose}
                />
              </div>

              {/* Row 2: Your Watchlist */}
              <div className="mb-5">
                <WatchlistTeaser
                  areas={productAreaWatchlists}
                  selectedAreaIds={defaultExecAreas}
                  onViewFull={() => navigate('/dashboards')}
                />
              </div>

              {/* Row 3: Your Work + Discover */}
              <div className="grid xl:grid-cols-[0.85fr_1.15fr] gap-5">
                <YourWorkCard
                  recentItems={recentWork}
                  quickActions={quickActions}
                  onItemClick={handleRecentWorkClick}
                  onActionClick={handleQuickAction}
                  variant="A"
                />
                <DiscoveryCard
                  {...discoveryFeed}
                  onItemClick={handleDiscoveryItemClick}
                />
              </div>
            </motion.div>

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
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-violet-600 dark:bg-violet-500">
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
