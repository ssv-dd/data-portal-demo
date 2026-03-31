import { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Sparkles, ArrowRight, CheckCircle2, MessageCircle, Loader2, RotateCcw, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { AIWidgetConfig } from '../AIWidgetCreator';

interface AIWidgetSidebarProps {
  onAIComplete: (config: AIWidgetConfig) => void;
}

interface ThoughtStep {
  id: string;
  text: string;
  status: 'processing' | 'complete';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  widgetPreview?: AIWidgetConfig | null;
  thoughts?: ThoughtStep[];
  question?: {
    text: string;
    options: string[];
    answered?: boolean;
    answer?: string;
  };
}

const SUGGESTED_PROMPTS = [
  'Show me revenue growth over time',
  'Track customer satisfaction scores',
  'Display delivery efficiency metrics',
  'Monitor conversion rate trends',
];

function classifyIntent(input: string): 'direct' | 'guided' {
  const lower = input.toLowerCase();
  const metricKeywords = ['revenue', 'orders', 'delivery', 'conversion', 'growth', 'kpi', 'aov', 'gov'];
  const chartKeywords = ['show', 'chart', 'graph', 'plot', 'visualize', 'trend', 'compare', 'breakdown'];
  const hasMetric = metricKeywords.some(k => lower.includes(k));
  const hasChart = chartKeywords.some(k => lower.includes(k));
  if (hasMetric && hasChart) return 'direct';
  return 'guided';
}

function generateDirectConfig(input: string): AIWidgetConfig {
  const lower = input.toLowerCase();
  if (lower.includes('orders')) return { title: 'Daily Orders', description: 'Order volume over time', category: 'operational', chartType: 'bar', metricId: 'daily-orders-ai' };
  if (lower.includes('delivery')) return { title: 'Avg Delivery Time', description: 'Mean delivery duration trend', category: 'operational', chartType: 'line', metricId: 'delivery-time-ai' };
  if (lower.includes('conversion')) return { title: 'Conversion Rate', description: 'Conversion rate trend', category: 'financial', chartType: 'area', metricId: 'conversion-rate-ai' };
  if (lower.includes('kpi')) return { title: 'Revenue KPI', description: 'Key revenue indicator', category: 'financial', chartType: 'line', metricId: 'revenue-kpi-ai' };
  return { title: 'Revenue Growth Rate', description: 'Month-over-month revenue growth', category: 'financial', chartType: 'line', metricId: 'revenue-growth-ai' };
}

const FOLLOW_UP_SUGGESTIONS: Record<string, string[]> = {
  financial: ['Add a KPI card for this metric', 'Break down by region'],
  operational: ['Compare week-over-week', 'Add a KPI summary'],
  'customer-support': ['Show trend over time', 'Add satisfaction KPI'],
  default: ['Add another chart', 'Add a KPI card'],
};

/* ─── Styled Components ─── */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding-bottom: ${Theme.usage.space.xSmall};
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.06);
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const HeaderIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: ${radius.md};
  background: linear-gradient(to bottom right, rgb(var(--app-purple-rgb) / 0.2), rgb(var(--app-fuchsia-rgb) / 0.15));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
    color: ${colors.violet600};
  }
`;

const HeaderTitle = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
`;

const ChatInputWrapper = styled.div`
  position: relative;
  background: rgb(var(--app-surface-rgb) / 0.6);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.1);
  border-radius: ${radius['2xl'] ?? '16px'};
  transition: all 200ms;
  overflow: hidden;

  &:focus-within {
    border-color: rgb(var(--app-violet-rgb) / 0.3);
    background: rgb(var(--app-surface-rgb) / 0.8);
    box-shadow: 0 0 0 3px rgb(var(--app-violet-rgb) / 0.06);
  }
`;

const ChatTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  max-height: 140px;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  font-size: ${Theme.usage.fontSize.xSmall};
  line-height: 1.5;
  color: ${colors.foreground};
  padding: ${Theme.usage.space.small};
  padding-bottom: 40px;
  font-family: inherit;

  &::placeholder {
    color: rgb(var(--app-muted-fg-rgb) / 0.5);
  }
`;

const ChatInputFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
`;

const SendButton = styled.button<{ $active: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: ${Theme.usage.borderRadius.full};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $active }) => $active ? 'pointer' : 'default'};
  transition: all 150ms;
  background: ${({ $active }) => $active ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'rgb(var(--app-overlay-rgb) / 0.08)'};
  color: ${({ $active }) => $active ? 'white' : 'rgb(var(--app-muted-fg-rgb) / 0.3)'};

  &:hover {
    background: ${({ $active }) => $active ? 'linear-gradient(135deg, #6d28d9, #1d4ed8)' : 'rgb(var(--app-overlay-rgb) / 0.08)'};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ThoughtStream = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
  padding-right: 2px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(var(--app-overlay-rgb) / 0.12);
    border-radius: 2px;
  }
`;

const ThoughtRow = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xSmall};
`;

const ThoughtIcon = styled.div`
  flex-shrink: 0;
  margin-top: 1px;
`;

const ThoughtText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.foreground};
  line-height: 1.4;
`;

const QuestionCard = styled.div`
  padding: ${Theme.usage.space.small};
  background: linear-gradient(to bottom right, var(--app-status-info-bg), #eef2ff);
  border: 1px solid #bfdbfe;
  border-radius: ${radius.md};
`;

const QuestionHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const QuestionBubble = styled.div`
  padding: 3px;
  background-color: var(--app-status-info-solid);
  border-radius: ${Theme.usage.borderRadius.full};
  flex-shrink: 0;
`;

const QuestionLabel = styled.p`
  font-size: 10px;
  color: #2563eb;
  margin-bottom: 2px;
  font-weight: 500;
`;

const QuestionText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.foreground};
  line-height: 1.4;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: ${Theme.usage.space.xSmall};
`;

const OptionButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.xSmall};
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  background: ${colors.white};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  text-align: left;
  transition: all 150ms;
  color: ${colors.foreground};

  &:hover:not(:disabled) {
    border-color: rgb(var(--app-primary-rgb) / 0.3);
    background: rgb(var(--app-primary-rgb) / 0.02);
  }

  svg {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    color: ${colors.mutedForeground};
  }
`;

const OptionText = styled.span`
  font-size: 11px;
  line-height: 1.3;
`;

const AnswerBox = styled.div`
  margin-top: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.xSmall};
  background: ${colors.white};
  border-radius: ${radius.md};
  border: 1px solid ${colors.border};
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xxSmall};
`;

const FinalCard = styled.div`
  padding: ${Theme.usage.space.small};
  background: linear-gradient(to bottom right, var(--app-status-success-bg-light), #ecfdf5);
  border: 1px solid #86efac;
  border-radius: ${radius.md};
`;

const FinalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xSmall};
`;

const FinalIconWrap = styled.div`
  padding: 4px;
  background-color: var(--app-status-success-solid-alt);
  border-radius: ${Theme.usage.borderRadius.full};
  flex-shrink: 0;
`;

const FinalBadges = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: ${Theme.usage.space.xxSmall};
`;

/* ─── New Chat-Mode Styled Components ─── */

const WelcomeArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.xSmall};
  text-align: center;
  padding: ${Theme.usage.space.small};
`;

const WelcomeIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${radius.lg};
  background: linear-gradient(to bottom right, rgb(var(--app-purple-rgb) / 0.15), rgb(var(--app-fuchsia-rgb) / 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WelcomeTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.small};
  font-weight: 600;
  color: ${colors.foreground};
  margin: 0;
`;

const WelcomeDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  line-height: 1.5;
  max-width: 240px;
`;

const PromptChipGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-top: ${Theme.usage.space.xxSmall};
`;

const PromptChip = styled.button`
  font-size: ${Theme.usage.fontSize.xxSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.full};
  background: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.06);
  cursor: pointer;
  text-align: left;
  color: ${colors.foreground};
  transition: all 150ms;
  line-height: 1.3;

  &:hover {
    border-color: rgb(var(--app-violet-rgb) / 0.2);
    background: rgb(var(--app-violet-rgb) / 0.04);
  }
`;

const InputDock = styled.div`
  flex-shrink: 0;
  padding-top: ${Theme.usage.space.xxSmall};
`;

const UserBubble = styled.div`
  background: rgb(var(--app-violet-rgb) / 0.06);
  border-radius: ${radius['2xl'] ?? '16px'};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  max-width: 85%;
  margin-left: auto;
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.foreground};
  line-height: 1.4;
`;

const NewChatButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11px;
  color: ${colors.mutedForeground};
  padding: 2px 6px;
  border-radius: ${radius.sm};
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;

  &:hover {
    color: ${colors.foreground};
    background: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const SuggestionChip = styled.button`
  padding: 4px 10px;
  border-radius: ${radius.md};
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.08);
  background: rgb(var(--app-surface-rgb) / 0.5);
  color: ${colors.mutedForeground};
  font-size: 11px;
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    border-color: rgb(var(--app-violet-rgb) / 0.15);
    color: ${colors.foreground};
  }
`;

const SuggestionRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: ${Theme.usage.space.xxSmall};
`;

const SuccessText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.green600};
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1.4;
`;

/* ─── Component ─── */

export function AIWidgetSidebar({ onAIComplete }: AIWidgetSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setUserInput('');
    setIsProcessing(false);
  }, []);

  const handleAddWidget = useCallback((config: AIWidgetConfig) => {
    onAIComplete(config);
    const category = config.category || 'default';
    const suggestions = FOLLOW_UP_SUGGESTIONS[category] || FOLLOW_UP_SUGGESTIONS.default;
    setMessages((prev) => [...prev, {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Added "${config.title}" to your dashboard.`,
      timestamp: Date.now(),
    }, {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '_suggestions_',
      timestamp: Date.now(),
      question: { text: '', options: suggestions, answered: false },
    }]);
  }, [onAIComplete]);

  const runDirectFlow = useCallback(async (input: string) => {
    setIsProcessing(true);
    const thinkingId = crypto.randomUUID();

    setMessages((prev) => [...prev, {
      id: thinkingId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      thoughts: [{ id: '1', text: 'Analyzing your request...', status: 'processing' }],
    }]);

    await new Promise(r => setTimeout(r, 800));
    setMessages((prev) => prev.map((m) => m.id === thinkingId ? {
      ...m,
      thoughts: [
        { id: '1', text: 'Analyzing your request...', status: 'complete' },
        { id: '2', text: 'Searching available metrics and data sources...', status: 'processing' },
      ],
    } : m));

    await new Promise(r => setTimeout(r, 1200));
    setMessages((prev) => prev.map((m) => m.id === thinkingId ? {
      ...m,
      thoughts: [
        { id: '1', text: 'Analyzing your request...', status: 'complete' },
        { id: '2', text: 'Searching available metrics and data sources...', status: 'complete' },
        { id: '3', text: 'Generating widget configuration...', status: 'processing' },
      ],
    } : m));

    await new Promise(r => setTimeout(r, 1000));
    const config = generateDirectConfig(input);

    setMessages((prev) => prev.map((m) => m.id === thinkingId ? {
      ...m,
      content: `Here's a ${config.chartType} chart for "${config.title}":`,
      thoughts: m.thoughts?.map((t) => ({ ...t, status: 'complete' as const })),
      widgetPreview: config,
    } : m));

    setIsProcessing(false);
  }, []);

  const runGuidedFlow = useCallback(async (input: string) => {
    setIsProcessing(true);
    const thinkingId = crypto.randomUUID();

    setMessages((prev) => [...prev, {
      id: thinkingId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      thoughts: [{ id: '1', text: 'Analyzing your request...', status: 'processing' }],
    }]);

    await new Promise(r => setTimeout(r, 800));
    setMessages((prev) => prev.map((m) => m.id === thinkingId ? {
      ...m,
      thoughts: [
        { id: '1', text: 'Analyzing your request...', status: 'complete' },
        { id: '2', text: 'Found multiple relevant metrics. Asking for clarification...', status: 'complete' },
      ],
    } : m));

    await new Promise(r => setTimeout(r, 600));

    const lower = input.toLowerCase();
    const isDelivery = lower.includes('delivery') || lower.includes('dasher') || lower.includes('efficiency');
    const isCustomer = lower.includes('customer') || lower.includes('satisfaction') || lower.includes('support');

    let options: string[];
    if (isDelivery) {
      options = ['Average Delivery Time (speed focus)', 'Dasher Efficiency Score (performance)', 'Order Accuracy Rate (quality)'];
    } else if (isCustomer) {
      options = ['Customer Satisfaction Score (CSAT)', 'Average Resolution Time (support speed)', 'Customer Service Call Rate'];
    } else {
      options = ['Revenue Growth Rate (month-over-month)', 'Gross Order Revenue (total revenue)', 'Average Order Value (per transaction)'];
    }

    setMessages((prev) => prev.map((m) => m.id === thinkingId ? {
      ...m,
      content: 'I found several related metrics.',
      thoughts: m.thoughts?.map((t) => ({ ...t, status: 'complete' as const })),
      question: { text: 'Which metric would you like to track?', options, answered: false },
    } : m));

    setIsProcessing(false);
  }, []);

  const handleQuestionAnswer = useCallback(async (messageId: string, answer: string) => {
    // Mark question as answered
    setMessages((prev) => prev.map((m) => m.id === messageId && m.question ? {
      ...m,
      question: { ...m.question, answered: true, answer },
    } : m));

    // Add user answer as a message
    setMessages((prev) => [...prev, {
      id: crypto.randomUUID(),
      role: 'user',
      content: answer,
      timestamp: Date.now(),
    }]);

    // Check if this is a chart type question
    const msg = messages.find((m) => m.id === messageId);
    const isChartTypeQuestion = msg?.question?.options?.some((o) => o.includes('chart'));

    if (isChartTypeQuestion) {
      // Generate widget from both answers
      setIsProcessing(true);
      const resultId = crypto.randomUUID();
      setMessages((prev) => [...prev, {
        id: resultId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        thoughts: [{ id: '1', text: 'Configuring widget...', status: 'processing' }],
      }]);

      await new Promise(r => setTimeout(r, 1000));

      let chartType: 'line' | 'area' | 'bar' = 'line';
      if (answer.includes('Bar')) chartType = 'bar';
      else if (answer.includes('Area')) chartType = 'area';

      const metricMsg = messages.find((m) => m.question?.answered && !m.question.options?.some((o) => o.includes('chart')));
      const metricAnswer = metricMsg?.question?.answer || '';

      let config: AIWidgetConfig;
      if (metricAnswer.includes('Revenue Growth')) config = { title: 'Revenue Growth Rate', description: 'Month-over-month revenue growth', category: 'financial', chartType, metricId: 'revenue-growth-ai' };
      else if (metricAnswer.includes('Gross Order')) config = { title: 'Gross Order Revenue', description: 'Total revenue from all orders', category: 'financial', chartType, metricId: 'gross-revenue-ai' };
      else if (metricAnswer.includes('Average Order')) config = { title: 'Average Order Value', description: 'Mean revenue per order', category: 'financial', chartType, metricId: 'aov-ai' };
      else if (metricAnswer.includes('Delivery Time')) config = { title: 'Average Delivery Time', description: 'Mean time from order to delivery', category: 'operational', chartType, metricId: 'delivery-time-ai' };
      else if (metricAnswer.includes('Dasher')) config = { title: 'Dasher Efficiency Score', description: 'Delivery performance rating', category: 'operational', chartType, metricId: 'dasher-efficiency-ai' };
      else if (metricAnswer.includes('Satisfaction')) config = { title: 'Customer Satisfaction Score', description: 'Overall CSAT rating', category: 'customer-support', chartType, metricId: 'csat-ai' };
      else config = { title: 'Revenue Growth Rate', description: 'Month-over-month revenue growth', category: 'financial', chartType, metricId: 'revenue-growth-ai' };

      setMessages((prev) => prev.map((m) => m.id === resultId ? {
        ...m,
        content: `Here's a ${config.chartType} chart for "${config.title}":`,
        thoughts: [{ id: '1', text: 'Configuring widget...', status: 'complete' }],
        widgetPreview: config,
      } : m));

      setIsProcessing(false);
    } else {
      // Ask chart type question
      setIsProcessing(true);
      await new Promise(r => setTimeout(r, 600));

      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Great choice!',
        timestamp: Date.now(),
        question: {
          text: 'Which chart type would you prefer?',
          options: ['Line chart — trends over time', 'Bar chart — comparisons', 'Area chart — magnitude & volume'],
          answered: false,
        },
      }]);

      setIsProcessing(false);
    }
  }, [messages]);

  const handleSubmit = useCallback(() => {
    const trimmed = userInput.trim();
    if (!trimmed || isProcessing) return;

    setMessages((prev) => [...prev, {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    }]);
    setUserInput('');

    const intent = classifyIntent(trimmed);
    if (intent === 'direct') {
      runDirectFlow(trimmed);
    } else {
      runGuidedFlow(trimmed);
    }
  }, [userInput, isProcessing, runDirectFlow, runGuidedFlow]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setUserInput(suggestion);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        role: 'user',
        content: suggestion,
        timestamp: Date.now(),
      }]);
      const intent = classifyIntent(suggestion);
      if (intent === 'direct') {
        runDirectFlow(suggestion);
      } else {
        runGuidedFlow(suggestion);
      }
      setUserInput('');
    }, 100);
  }, [runDirectFlow, runGuidedFlow]);

  /* ─── Welcome State ─── */
  if (messages.length === 0) {
    return (
      <Container>
        <WelcomeArea>
          <WelcomeIconBox>
            <Sparkles style={{ width: 22, height: 22, color: colors.violet600 }} />
          </WelcomeIconBox>
          <WelcomeTitle>AI-BI Assistant</WelcomeTitle>
          <WelcomeDescription>
            Describe the chart or metric you need and I'll build it for your dashboard.
          </WelcomeDescription>
          <PromptChipGrid>
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <PromptChip key={idx} onClick={() => setUserInput(prompt)}>
                {prompt}
              </PromptChip>
            ))}
          </PromptChipGrid>
        </WelcomeArea>

        <InputDock>
          <ChatInputWrapper>
            <ChatTextarea
              placeholder="Describe the widget you want to create..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <ChatInputFooter>
              <SendButton $active={!!userInput.trim()} onClick={handleSubmit}>
                <ArrowUp />
              </SendButton>
            </ChatInputFooter>
          </ChatInputWrapper>
        </InputDock>
      </Container>
    );
  }

  /* ─── Chat State ─── */
  return (
    <Container>
      <Header>
        <HeaderIcon><Sparkles /></HeaderIcon>
        <HeaderTitle>AI-BI Assistant</HeaderTitle>
        <NewChatButton onClick={handleNewChat}>
          <RotateCcw style={{ width: 12, height: 12 }} />
          New Chat
        </NewChatButton>
      </Header>

      <ThoughtStream style={{ padding: Theme.usage.space.small }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {msg.role === 'user' && (
                <UserBubble>{msg.content}</UserBubble>
              )}

              {msg.role === 'assistant' && (
                <div>
                  {msg.thoughts && msg.thoughts.map((step) => (
                    <ThoughtRow key={step.id}>
                      <ThoughtIcon>
                        {step.status === 'processing' ? (
                          <Loader2 style={{ height: 14, width: 14, color: colors.primary, animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <CheckCircle2 style={{ height: 14, width: 14, color: colors.green600 }} />
                        )}
                      </ThoughtIcon>
                      <ThoughtText>{step.text}</ThoughtText>
                    </ThoughtRow>
                  ))}

                  {msg.content && msg.content !== '_suggestions_' && !msg.widgetPreview && !msg.question && (
                    <SuccessText>
                      <CheckCircle2 style={{ height: 14, width: 14 }} />
                      {msg.content}
                    </SuccessText>
                  )}

                  {msg.content && msg.widgetPreview && (
                    <ThoughtText style={{ marginBottom: Theme.usage.space.xxSmall }}>{msg.content}</ThoughtText>
                  )}

                  {msg.widgetPreview && (
                    <FinalCard>
                      <FinalHeader>
                        <FinalIconWrap>
                          <CheckCircle2 style={{ height: 14, width: 14, color: colors.white }} />
                        </FinalIconWrap>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: 2 }}>
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>Widget Ready</span>
                            <Sparkles style={{ height: 12, width: 12, color: colors.green600 }} />
                          </div>
                          <p style={{ fontSize: '11px', color: colors.mutedForeground, lineHeight: 1.4 }}>
                            {msg.widgetPreview.description}
                          </p>
                          <FinalBadges>
                            <Badge variant="secondary" style={{ fontSize: '10px' }}>{msg.widgetPreview.title}</Badge>
                            <Badge variant="outline" style={{ fontSize: '10px' }}>{msg.widgetPreview.chartType} chart</Badge>
                          </FinalBadges>
                        </div>
                      </FinalHeader>
                      <div style={{ marginTop: Theme.usage.space.xSmall }}>
                        <Button
                          size="sm"
                          onClick={() => handleAddWidget(msg.widgetPreview!)}
                          style={{ gap: '4px', fontSize: '12px', width: '100%' }}
                        >
                          <CheckCircle2 style={{ height: 12, width: 12 }} />
                          Add to Dashboard
                        </Button>
                      </div>
                    </FinalCard>
                  )}

                  {msg.question && msg.question.text && (
                    <QuestionCard>
                      <QuestionHeaderRow>
                        <QuestionBubble>
                          <MessageCircle style={{ height: 12, width: 12, color: colors.white }} />
                        </QuestionBubble>
                        <div style={{ flex: 1 }}>
                          <QuestionLabel>AI Assistant</QuestionLabel>
                          <QuestionText>{msg.question.text}</QuestionText>
                        </div>
                      </QuestionHeaderRow>

                      {msg.question.answered ? (
                        <AnswerBox>
                          <CheckCircle2 style={{ height: 14, width: 14, color: colors.green600, flexShrink: 0, marginTop: 1 }} />
                          <span style={{ fontSize: '12px' }}>{msg.question.answer}</span>
                        </AnswerBox>
                      ) : (
                        <OptionsContainer>
                          {msg.question.options.map((option, optIndex) => (
                            <OptionButton
                              key={optIndex}
                              $disabled={isProcessing}
                              disabled={isProcessing}
                              onClick={() => handleQuestionAnswer(msg.id, option)}
                            >
                              <ArrowRight />
                              <OptionText>{option}</OptionText>
                            </OptionButton>
                          ))}
                        </OptionsContainer>
                      )}
                    </QuestionCard>
                  )}

                  {msg.content === '_suggestions_' && msg.question && !msg.question.answered && (
                    <SuggestionRow>
                      {msg.question.options.map((s, i) => (
                        <SuggestionChip key={i} onClick={() => handleSuggestionClick(s)}>
                          {s}
                        </SuggestionChip>
                      ))}
                    </SuggestionRow>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </ThoughtStream>

      <InputDock>
        <ChatInputWrapper>
          <ChatTextarea
            placeholder="Ask for another chart or metric..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isProcessing}
          />
          <ChatInputFooter>
            <SendButton $active={!!userInput.trim() && !isProcessing} onClick={handleSubmit}>
              <ArrowUp />
            </SendButton>
          </ChatInputFooter>
        </ChatInputWrapper>
      </InputDock>
    </Container>
  );
}
