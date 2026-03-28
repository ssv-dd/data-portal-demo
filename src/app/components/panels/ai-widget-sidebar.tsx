import { useState, useEffect, useRef } from 'react';
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

interface AIQuestion {
  id: string;
  question: string;
  options?: string[];
  answered?: boolean;
  answer?: string;
}

type SidebarMode = 'input' | 'processing';

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

const SuggestionChips = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
`;

const SuggestionLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  font-weight: 500;
`;

const SuggestionPill = styled.button`
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
    border-color: rgb(var(--app-primary-rgb) / 0.3);
    background: rgb(var(--app-primary-rgb) / 0.04);
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

const QueryBadge = styled.div`
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  background: rgb(var(--app-primary-rgb) / 0.05);
  border: 1px solid rgb(var(--app-primary-rgb) / 0.12);
  border-radius: ${radius.md};
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.foreground};
  line-height: 1.4;
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

const ActionRow = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xxSmall};
  padding-top: ${Theme.usage.space.xSmall};
  border-top: 1px solid rgb(var(--app-overlay-rgb) / 0.06);
`;

export function AIWidgetSidebar({ onAIComplete }: AIWidgetSidebarProps) {
  const [mode, setMode] = useState<SidebarMode>('input');
  const [userInput, setUserInput] = useState('');
  const [thoughtSteps, setThoughtSteps] = useState<ThoughtStep[]>([]);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalConfig, setFinalConfig] = useState<AIWidgetConfig | null>(null);
  const thoughtsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    thoughtsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thoughtSteps, questions, finalConfig]);

  const resetState = () => {
    setMode('input');
    setUserInput('');
    setThoughtSteps([]);
    setQuestions([]);
    setIsProcessing(false);
    setFinalConfig(null);
  };

  const simulateAIProcessing = async () => {
    setIsProcessing(true);
    setMode('processing');

    const input = userInput.toLowerCase();
    const isDeliveryRelated = input.includes('delivery') || input.includes('dasher') || input.includes('efficiency');
    const isCustomerRelated = input.includes('customer') || input.includes('satisfaction') || input.includes('support');

    await new Promise(resolve => setTimeout(resolve, 800));
    setThoughtSteps(prev => [...prev, { id: '1', text: 'Analyzing your request and identifying the metric type...', status: 'processing' }]);

    await new Promise(resolve => setTimeout(resolve, 1500));
    setThoughtSteps(prev => prev.map(step => step.id === '1' ? { ...step, status: 'complete' } : step));

    await new Promise(resolve => setTimeout(resolve, 600));
    setThoughtSteps(prev => [...prev, { id: '2', text: 'Searching available metrics and data sources...', status: 'processing' }]);

    await new Promise(resolve => setTimeout(resolve, 1400));
    setThoughtSteps(prev => prev.map(step => step.id === '2' ? { ...step, status: 'complete' } : step));

    await new Promise(resolve => setTimeout(resolve, 600));
    setThoughtSteps(prev => [...prev, { id: '3', text: 'Found multiple relevant metrics. Asking for clarification...', status: 'complete' }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    let question: AIQuestion;
    if (isDeliveryRelated) {
      question = { id: 'q1', question: 'I found several delivery-related metrics. Which aspect would you like to track?', options: ['Average Delivery Time (speed focus)', 'Dasher Efficiency Score (performance)', 'Order Accuracy Rate (quality)'], answered: false };
    } else if (isCustomerRelated) {
      question = { id: 'q1', question: 'I found several customer-related metrics. Which one interests you most?', options: ['Customer Satisfaction Score (CSAT)', 'Average Resolution Time (support speed)', 'Customer Service Call Rate'], answered: false };
    } else {
      question = { id: 'q1', question: 'I found several revenue-related metrics. Which one would you like to track?', options: ['Revenue Growth Rate (month-over-month)', 'Gross Order Revenue (total revenue)', 'Average Order Value (per transaction)'], answered: false };
    }

    setQuestions([question]);
    setIsProcessing(false);
  };

  const handleQuestionAnswer = async (questionId: string, answer: string) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, answered: true, answer } : q));
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 800));
    setThoughtSteps(prev => [...prev, { id: '4', text: 'Determining the best visualization type...', status: 'processing' }]);

    await new Promise(resolve => setTimeout(resolve, 1200));
    setThoughtSteps(prev => prev.map(step => step.id === '4' ? { ...step, status: 'complete' } : step));

    await new Promise(resolve => setTimeout(resolve, 600));
    setThoughtSteps(prev => [...prev, { id: '5', text: 'Considering optimal chart type...', status: 'complete' }]);

    await new Promise(resolve => setTimeout(resolve, 400));
    setQuestions(prev => [...prev, { id: 'q2', question: 'Which chart type would you prefer?', options: ['Line chart — trends over time', 'Bar chart — comparisons', 'Area chart — magnitude & volume'], answered: false }]);

    setIsProcessing(false);
  };

  const handleSecondQuestionAnswer = async (questionId: string, answer: string) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, answered: true, answer } : q));
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 800));
    setThoughtSteps(prev => [...prev, { id: '6', text: 'Configuring widget with your preferences...', status: 'processing' }]);

    await new Promise(resolve => setTimeout(resolve, 1000));
    setThoughtSteps(prev => prev.map(step => step.id === '6' ? { ...step, status: 'complete' } : step));

    await new Promise(resolve => setTimeout(resolve, 400));
    setThoughtSteps(prev => [...prev, { id: '7', text: 'Widget ready!', status: 'complete' }]);

    const firstQuestion = questions[0];
    const firstAnswer = firstQuestion?.answer || '';

    let chartType: 'line' | 'area' | 'bar' = 'line';
    if (answer.includes('Line')) chartType = 'line';
    else if (answer.includes('Bar')) chartType = 'bar';
    else if (answer.includes('Area')) chartType = 'area';

    let config: AIWidgetConfig;

    if (firstAnswer.includes('Revenue Growth')) {
      config = { title: 'Revenue Growth Rate', description: 'Month-over-month revenue growth percentage', category: 'financial', chartType, metricId: 'revenue-growth-ai' };
    } else if (firstAnswer.includes('Gross Order Revenue')) {
      config = { title: 'Gross Order Revenue', description: 'Total revenue from all orders', category: 'financial', chartType, metricId: 'gross-revenue-ai' };
    } else if (firstAnswer.includes('Average Order Value')) {
      config = { title: 'Average Order Value', description: 'Mean revenue per order', category: 'financial', chartType, metricId: 'average-order-value-ai' };
    } else if (firstAnswer.includes('Delivery Time')) {
      config = { title: 'Average Delivery Time', description: 'Mean time from order to delivery', category: 'operational', chartType, metricId: 'delivery-time-ai' };
    } else if (firstAnswer.includes('Dasher Efficiency')) {
      config = { title: 'Dasher Efficiency Score', description: 'Delivery performance and efficiency rating', category: 'operational', chartType, metricId: 'dasher-efficiency-ai' };
    } else if (firstAnswer.includes('Satisfaction')) {
      config = { title: 'Customer Satisfaction Score', description: 'Overall customer satisfaction rating', category: 'customer-support', chartType, metricId: 'csat-score-ai' };
    } else {
      config = { title: 'Revenue Growth Rate', description: 'Month-over-month revenue growth percentage', category: 'financial', chartType, metricId: 'revenue-growth-ai' };
    }

    setFinalConfig(config);
    setIsProcessing(false);
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    simulateAIProcessing();
  };

  const handleAddWidget = () => {
    if (finalConfig) {
      onAIComplete(finalConfig);
      resetState();
    }
  };

  if (mode === 'input') {
    return (
      <Container>
        <Header>
          <HeaderIcon><Sparkles /></HeaderIcon>
          <HeaderTitle>AI Widget Creator</HeaderTitle>
        </Header>

        <ChatInputWrapper>
          <ChatTextarea
            placeholder="What widget would you like to create? Describe the metric or chart you need..."
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

        <SuggestionChips>
          <SuggestionLabel>Try asking:</SuggestionLabel>
          {[
            'Show me revenue growth over time',
            'Track customer satisfaction scores',
            'Display delivery efficiency metrics',
            'Monitor conversion rate trends',
          ].map((example, idx) => (
            <SuggestionPill key={idx} onClick={() => setUserInput(example)}>
              {example}
            </SuggestionPill>
          ))}
        </SuggestionChips>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderIcon><Sparkles /></HeaderIcon>
        <HeaderTitle>AI Widget Creator</HeaderTitle>
      </Header>

      <ThoughtStream>
        <QueryBadge>
          <span style={{ color: colors.mutedForeground }}>Query:</span> {userInput}
        </QueryBadge>

        <AnimatePresence>
          {thoughtSteps.map((step) => (
            <ThoughtRow
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
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

          {questions.map((question) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <QuestionCard>
                <QuestionHeaderRow>
                  <QuestionBubble>
                    <MessageCircle style={{ height: 12, width: 12, color: colors.white }} />
                  </QuestionBubble>
                  <div style={{ flex: 1 }}>
                    <QuestionLabel>AI Assistant</QuestionLabel>
                    <QuestionText>{question.question}</QuestionText>
                  </div>
                </QuestionHeaderRow>

                {question.answered ? (
                  <AnswerBox>
                    <CheckCircle2 style={{ height: 14, width: 14, color: colors.green600, flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: '12px' }}>{question.answer}</span>
                  </AnswerBox>
                ) : (
                  <OptionsContainer>
                    {question.options?.map((option, optIndex) => (
                      <OptionButton
                        key={optIndex}
                        $disabled={isProcessing}
                        disabled={isProcessing}
                        onClick={() => {
                          if (question.id === 'q1') handleQuestionAnswer(question.id, option);
                          else handleSecondQuestionAnswer(question.id, option);
                        }}
                      >
                        <ArrowRight />
                        <OptionText>{option}</OptionText>
                      </OptionButton>
                    ))}
                  </OptionsContainer>
                )}
              </QuestionCard>
            </motion.div>
          ))}

          {finalConfig && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
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
                      {finalConfig.description}
                    </p>
                    <FinalBadges>
                      <Badge variant="secondary" style={{ fontSize: '10px' }}>{finalConfig.title}</Badge>
                      <Badge variant="outline" style={{ fontSize: '10px' }}>{finalConfig.chartType} chart</Badge>
                    </FinalBadges>
                  </div>
                </FinalHeader>
              </FinalCard>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={thoughtsEndRef} />
      </ThoughtStream>

      <ActionRow>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetState}
          disabled={isProcessing}
          style={{ gap: '4px', fontSize: '12px', flex: 1 }}
        >
          <RotateCcw style={{ height: 12, width: 12 }} />
          Start Over
        </Button>
        {finalConfig && (
          <Button
            size="sm"
            onClick={handleAddWidget}
            style={{ gap: '4px', fontSize: '12px', flex: 1 }}
          >
            <CheckCircle2 style={{ height: 12, width: 12 }} />
            Add Widget
          </Button>
        )}
      </ActionRow>
    </Container>
  );
}
