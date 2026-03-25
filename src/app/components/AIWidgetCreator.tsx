import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, ArrowRight, CheckCircle2, MessageCircle, Loader2, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';

interface AIWidgetCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onManualCreate: () => void;
  onAIComplete: (widgetConfig: AIWidgetConfig) => void;
}

export interface AIWidgetConfig {
  title: string;
  description: string;
  category: string;
  chartType: 'line' | 'area' | 'bar';
  metricId: string;
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

type CreationMode = 'ai-input' | 'ai-processing';

const FlexCol = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
  margin-top: ${Theme.usage.space.medium};
`;

const InputGlowWrap = styled.div`
  position: relative;
`;

const InputGlow = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgb(var(--app-purple-rgb) / 0.1), rgb(var(--app-blue-rgb) / 0.1));
  border-radius: ${radius.lg};
  filter: blur(12px);
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xxSmall};
  background-color: ${colors.background};
  border-radius: ${radius.lg};
  border: 2px solid rgb(var(--app-primary-rgb) / 0.2);
  transition: border-color 150ms;

  &:focus-within {
    border-color: rgb(var(--app-primary-rgb) / 0.4);
  }
`;

const SuggestionsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`;

const SuggestionCard = styled.div`
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  padding: ${Theme.usage.space.medium};
  background: rgb(var(--app-muted-rgb) / 0.3);
`;

const SuggestionLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  margin-bottom: ${Theme.usage.space.small};
`;

const SuggestionPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${Theme.usage.space.xSmall};
`;

const SuggestionPill = styled.button`
  font-size: ${Theme.usage.fontSize.xxSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.full};
  background: ${colors.white};
  border: 1px solid ${colors.border};
  cursor: pointer;
  text-align: left;
  transition: all 150ms;

  &:hover {
    border-color: rgb(var(--app-primary-rgb) / 0.5);
    background: rgb(var(--app-primary-rgb) / 0.05);
  }
`;

const InputFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-top: ${Theme.usage.space.medium};
  padding-top: ${Theme.usage.space.medium};
  border-top: 1px solid ${colors.border};
`;

const ProcessingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
  flex: 1;
  overflow: hidden;
`;

const QueryCard = styled(Card)`
  padding: ${Theme.usage.space.medium};
  background: rgb(var(--app-primary-rgb) / 0.05);
  border-color: rgb(var(--app-primary-rgb) / 0.2);
`;

const ThoughtStream = styled.div`
  flex: 1;
  overflow-y: auto;
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  padding: ${Theme.usage.space.medium};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
  background: linear-gradient(to bottom, ${colors.white}, ${colors.slate50});
`;

const ThoughtRow = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
`;

const ThoughtIcon = styled.div`
  flex-shrink: 0;
  margin-top: ${Theme.usage.space.xxSmall};
`;

const QuestionCard = styled(Card)`
  padding: ${Theme.usage.space.medium};
  background: linear-gradient(to bottom right, var(--app-status-info-bg), #eef2ff);
  border-color: #bfdbfe;
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.small};
`;

const QuestionBubble = styled.div`
  padding: ${Theme.usage.space.xxSmall};
  background-color: var(--app-status-info-solid);
  border-radius: ${Theme.usage.borderRadius.full};
  flex-shrink: 0;
`;

const QuestionLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: #2563eb;
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const AnswerBox = styled.div`
  margin-left: ${Theme.usage.space.xxLarge};
  padding: ${Theme.usage.space.small};
  background: ${colors.white};
  border-radius: ${radius.lg};
  border: 1px solid ${colors.border};
  box-shadow: 0 1px 2px rgb(var(--app-overlay-rgb) / 0.05);
`;

const AnswerContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xSmall};
`;

const OptionsContainer = styled.div`
  margin-left: ${Theme.usage.space.xxLarge};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const FinalCard = styled(Card)`
  padding: 20px;
  background: linear-gradient(to bottom right, var(--app-status-success-bg-light), #ecfdf5);
  border-color: #86efac;
  box-shadow: 0 10px 15px -3px rgb(var(--app-overlay-rgb) / 0.1);
`;

const FinalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
`;

const FinalIconWrap = styled.div`
  padding: ${Theme.usage.space.xSmall};
  background-color: var(--app-status-success-solid-alt);
  border-radius: ${Theme.usage.borderRadius.full};
  flex-shrink: 0;
`;

const FinalTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const FinalDesc = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.small};
`;

const FinalBadges = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xSmall};
  flex-wrap: wrap;
`;

const ActionFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding-top: ${Theme.usage.space.medium};
  border-top: 1px solid ${colors.border};
`;

const ActionGroup = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xSmall};
`;

export function AIWidgetCreator({ open, onOpenChange, onManualCreate, onAIComplete }: AIWidgetCreatorProps) {
  const [mode, setMode] = useState<CreationMode>('ai-input');
  const [userInput, setUserInput] = useState('');
  const [thoughtSteps, setThoughtSteps] = useState<ThoughtStep[]>([]);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalConfig, setFinalConfig] = useState<AIWidgetConfig | null>(null);
  const thoughtsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setMode('ai-input');
        setUserInput('');
        setThoughtSteps([]);
        setQuestions([]);
        setIsProcessing(false);
        setFinalConfig(null);
      }, 300);
    }
  }, [open]);

  useEffect(() => {
    thoughtsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thoughtSteps, questions]);

  const handleSwitchToManual = () => {
    onOpenChange(false);
    onManualCreate();
  };

  const simulateAIProcessing = async () => {
    setIsProcessing(true);
    setMode('ai-processing');
    
    const input = userInput.toLowerCase();
    const isDeliveryRelated = input.includes('delivery') || input.includes('dasher') || input.includes('efficiency');
    const isCustomerRelated = input.includes('customer') || input.includes('satisfaction') || input.includes('support');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setThoughtSteps(prev => [...prev, { id: '1', text: 'Analyzing your request and identifying the metric type...', status: 'processing' }]);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setThoughtSteps(prev => prev.map(step => step.id === '1' ? { ...step, status: 'complete' } : step));
    
    await new Promise(resolve => setTimeout(resolve, 600));
    setThoughtSteps(prev => [...prev, { id: '2', text: 'Searching through available metrics and data sources...', status: 'processing' }]);
    
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
    setThoughtSteps(prev => [...prev, { id: '4', text: 'Perfect! Determining the best visualization type for this metric...', status: 'processing' }]);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    setThoughtSteps(prev => prev.map(step => step.id === '4' ? { ...step, status: 'complete' } : step));
    
    await new Promise(resolve => setTimeout(resolve, 600));
    setThoughtSteps(prev => [...prev, { id: '5', text: 'Considering optimal chart type for visualization...', status: 'complete' }]);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    setQuestions(prev => [...prev, { id: 'q2', question: 'Which chart type would you prefer for this metric?', options: ['Line chart - best for trends over time', 'Bar chart - great for comparisons', 'Area chart - emphasizes magnitude and volume'], answered: false }]);
    
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
    setThoughtSteps(prev => [...prev, { id: '7', text: 'Widget ready! Preview below.', status: 'complete' }]);
    
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
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Add Widget with AI">
      <DialogContent style={{ maxWidth: '768px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <DialogDescription>
            {mode === 'ai-input' && 'Describe the widget you want to create'}
            {mode === 'ai-processing' && 'AI is creating your widget...'}
          </DialogDescription>

        <FlexCol>
          {mode === 'ai-input' && (
            <InputSection>
              <InputGlowWrap>
                <InputGlow />
                <InputContainer>
                  <Input
                    placeholder="e.g., Show me revenue growth over time"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    style={{ flex: 1, border: 0, boxShadow: 'none' }}
                    autoFocus
                  />
                  <Button 
                    onClick={handleSubmit}
                    disabled={!userInput.trim()}
                    style={{ gap: '8px', background: 'linear-gradient(to right, #9333ea, #2563eb)' }}
                  >
                    <Sparkles style={{ height: '16px', width: '16px' }} />
                    Create
                  </Button>
                </InputContainer>
              </InputGlowWrap>
              
              <SuggestionsBox>
                <SuggestionCard>
                  <SuggestionLabel>💡 <strong>Try asking:</strong></SuggestionLabel>
                  <SuggestionPills>
                    {[
                      'Show me revenue growth over time',
                      'Track customer satisfaction scores',
                      'Display delivery efficiency metrics',
                      'Monitor conversion rate trends'
                    ].map((example, idx) => (
                      <SuggestionPill key={idx} onClick={() => setUserInput(example)}>
                        {example}
                      </SuggestionPill>
                    ))}
                  </SuggestionPills>
                </SuggestionCard>
              </SuggestionsBox>

              <InputFooter>
                <Button 
                  variant="ghost" 
                  onClick={handleSwitchToManual}
                  style={{ gap: '4px', color: colors.mutedForeground }}
                  size="sm"
                >
                  <List style={{ height: '16px', width: '16px' }} />
                  Browse categories manually
                </Button>
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </InputFooter>
            </InputSection>
          )}

          {mode === 'ai-processing' && (
            <ProcessingSection>
              <QueryCard>
                <p style={{ fontSize: '14px' }}>
                  <span style={{ color: colors.mutedForeground }}>Your request:</span>{' '}
                  <span>{userInput}</span>
                </p>
              </QueryCard>

              <ThoughtStream>
                <AnimatePresence>
                  {thoughtSteps.map((step) => (
                    <ThoughtRow
                      key={step.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ThoughtIcon>
                        {step.status === 'processing' ? (
                          <Loader2 style={{ height: '16px', width: '16px', color: colors.primary, animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <CheckCircle2 style={{ height: '16px', width: '16px', color: colors.green600 }} />
                        )}
                      </ThoughtIcon>
                      <p style={{ fontSize: '14px', flex: 1 }}>{step.text}</p>
                    </ThoughtRow>
                  ))}

                  {questions.map((question) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <QuestionCard>
                        <QuestionHeader>
                          <QuestionBubble>
                            <MessageCircle style={{ height: '14px', width: '14px', color: colors.white }} />
                          </QuestionBubble>
                          <div style={{ flex: 1 }}>
                            <QuestionLabel>AI Assistant</QuestionLabel>
                            <p style={{ fontSize: '14px' }}>{question.question}</p>
                          </div>
                        </QuestionHeader>
                        
                        {question.answered ? (
                          <AnswerBox>
                            <AnswerContent>
                              <CheckCircle2 style={{ height: '16px', width: '16px', color: colors.green600, flexShrink: 0, marginTop: '2px' }} />
                              <p style={{ fontSize: '14px' }}>{question.answer}</p>
                            </AnswerContent>
                          </AnswerBox>
                        ) : (
                          <OptionsContainer>
                            {question.options?.map((option, optIndex) => (
                              <Button
                                key={optIndex}
                                variant="outline"
                                size="sm"
                                style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left', height: 'auto', padding: '12px 12px', background: colors.white }}
                                onClick={() => {
                                  if (question.id === 'q1') handleQuestionAnswer(question.id, option);
                                  else handleSecondQuestionAnswer(question.id, option);
                                }}
                                disabled={isProcessing}
                              >
                                <ArrowRight style={{ height: '14px', width: '14px', marginRight: '8px', flexShrink: 0 }} />
                                <span style={{ fontSize: '12px' }}>{option}</span>
                              </Button>
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
                      transition={{ duration: 0.4 }}
                    >
                      <FinalCard>
                        <FinalHeader>
                          <FinalIconWrap>
                            <CheckCircle2 style={{ height: '16px', width: '16px', color: colors.white }} />
                          </FinalIconWrap>
                          <div style={{ flex: 1 }}>
                            <FinalTitleRow>
                              <h4 style={{ fontSize: '14px' }}>Widget Ready</h4>
                              <Sparkles style={{ height: '14px', width: '14px', color: colors.green600 }} />
                            </FinalTitleRow>
                            <FinalDesc>{finalConfig.description}</FinalDesc>
                            <FinalBadges>
                              <Badge variant="secondary" style={{ gap: '4px' }}>{finalConfig.title}</Badge>
                              <Badge variant="outline">{finalConfig.chartType} chart</Badge>
                              <Badge variant="outline" style={{ textTransform: 'capitalize' }}>{finalConfig.category}</Badge>
                            </FinalBadges>
                          </div>
                        </FinalHeader>
                      </FinalCard>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={thoughtsEndRef} />
              </ThoughtStream>

              <ActionFooter>
                <ActionGroup>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setMode('ai-input');
                      setThoughtSteps([]);
                      setQuestions([]);
                      setFinalConfig(null);
                      setIsProcessing(false);
                    }}
                    disabled={isProcessing}
                    size="sm"
                  >
                    Start Over
                  </Button>
                  <Button 
                    variant="link" 
                    onClick={handleSwitchToManual}
                    disabled={isProcessing}
                    style={{ color: colors.mutedForeground, gap: '4px' }}
                    size="sm"
                  >
                    <List style={{ height: '14px', width: '14px' }} />
                    Switch to manual
                  </Button>
                </ActionGroup>
                <ActionGroup>
                  <Button 
                    variant="ghost" 
                    onClick={() => onOpenChange(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  {finalConfig && (
                    <Button onClick={handleAddWidget} style={{ gap: '8px' }}>
                      <CheckCircle2 style={{ height: '16px', width: '16px' }} />
                      Add Widget to Dashboard
                    </Button>
                  )}
                </ActionGroup>
              </ActionFooter>
            </ProcessingSection>
          )}
        </FlexCol>
      </DialogContent>
    </Dialog>
  );
}
