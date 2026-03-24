import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, ArrowRight, CheckCircle2, MessageCircle, Loader2, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

export function AIWidgetCreator({ open, onOpenChange, onManualCreate, onAIComplete }: AIWidgetCreatorProps) {
  const [mode, setMode] = useState<CreationMode>('ai-input');
  const [userInput, setUserInput] = useState('');
  const [thoughtSteps, setThoughtSteps] = useState<ThoughtStep[]>([]);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalConfig, setFinalConfig] = useState<AIWidgetConfig | null>(null);
  const thoughtsEndRef = useRef<HTMLDivElement>(null);

  // Reset state when dialog closes
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

  // Auto-scroll to bottom of thoughts
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
    
    // Detect keywords in user input to customize the flow
    const input = userInput.toLowerCase();
    const isDeliveryRelated = input.includes('delivery') || input.includes('dasher') || input.includes('efficiency');
    const isCustomerRelated = input.includes('customer') || input.includes('satisfaction') || input.includes('support');
    
    // Step 1: Understanding request
    await new Promise(resolve => setTimeout(resolve, 800));
    setThoughtSteps(prev => [...prev, {
      id: '1',
      text: 'Analyzing your request and identifying the metric type...',
      status: 'processing'
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setThoughtSteps(prev => prev.map(step => 
      step.id === '1' ? { ...step, status: 'complete' } : step
    ));
    
    // Step 2: Searching for relevant metrics
    await new Promise(resolve => setTimeout(resolve, 600));
    setThoughtSteps(prev => [...prev, {
      id: '2',
      text: 'Searching through available metrics and data sources...',
      status: 'processing'
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 1400));
    setThoughtSteps(prev => prev.map(step => 
      step.id === '2' ? { ...step, status: 'complete' } : step
    ));
    
    // Step 3: Ask clarifying question based on input
    await new Promise(resolve => setTimeout(resolve, 600));
    setThoughtSteps(prev => [...prev, {
      id: '3',
      text: 'Found multiple relevant metrics. Asking for clarification...',
      status: 'complete'
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Customize question based on user input
    let question: AIQuestion;
    if (isDeliveryRelated) {
      question = {
        id: 'q1',
        question: 'I found several delivery-related metrics. Which aspect would you like to track?',
        options: [
          'Average Delivery Time (speed focus)',
          'Dasher Efficiency Score (performance)',
          'Order Accuracy Rate (quality)',
        ],
        answered: false
      };
    } else if (isCustomerRelated) {
      question = {
        id: 'q1',
        question: 'I found several customer-related metrics. Which one interests you most?',
        options: [
          'Customer Satisfaction Score (CSAT)',
          'Average Resolution Time (support speed)',
          'Customer Service Call Rate',
        ],
        answered: false
      };
    } else {
      question = {
        id: 'q1',
        question: 'I found several revenue-related metrics. Which one would you like to track?',
        options: [
          'Revenue Growth Rate (month-over-month)',
          'Gross Order Revenue (total revenue)',
          'Average Order Value (per transaction)',
        ],
        answered: false
      };
    }
    
    setQuestions([question]);
    setIsProcessing(false);
  };

  const handleQuestionAnswer = async (questionId: string, answer: string) => {
    // Mark question as answered
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, answered: true, answer } : q
    ));
    
    setIsProcessing(true);
    
    // Continue processing
    await new Promise(resolve => setTimeout(resolve, 800));
    setThoughtSteps(prev => [...prev, {
      id: '4',
      text: 'Perfect! Determining the best visualization type for this metric...',
      status: 'processing'
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    setThoughtSteps(prev => prev.map(step => 
      step.id === '4' ? { ...step, status: 'complete' } : step
    ));
    
    // Ask about chart type
    await new Promise(resolve => setTimeout(resolve, 600));
    setThoughtSteps(prev => [...prev, {
      id: '5',
      text: 'Considering optimal chart type for visualization...',
      status: 'complete'
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    setQuestions(prev => [...prev, {
      id: 'q2',
      question: 'Which chart type would you prefer for this metric?',
      options: [
        'Line chart - best for trends over time',
        'Bar chart - great for comparisons',
        'Area chart - emphasizes magnitude and volume',
      ],
      answered: false
    }]);
    
    setIsProcessing(false);
  };

  const handleSecondQuestionAnswer = async (questionId: string, answer: string) => {
    // Mark question as answered
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, answered: true, answer } : q
    ));
    
    setIsProcessing(true);
    
    // Final processing
    await new Promise(resolve => setTimeout(resolve, 800));
    setThoughtSteps(prev => [...prev, {
      id: '6',
      text: 'Configuring widget with your preferences...',
      status: 'processing'
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setThoughtSteps(prev => prev.map(step => 
      step.id === '6' ? { ...step, status: 'complete' } : step
    ));
    
    await new Promise(resolve => setTimeout(resolve, 400));
    setThoughtSteps(prev => [...prev, {
      id: '7',
      text: 'Widget ready! Preview below.',
      status: 'complete'
    }]);
    
    // Determine metric based on first question answer
    const firstQuestion = questions[0];
    const firstAnswer = firstQuestion?.answer || '';
    
    // Set final configuration based on selected metric
    let chartType: 'line' | 'area' | 'bar' = 'line';
    if (answer.includes('Line')) {
      chartType = 'line';
    } else if (answer.includes('Bar')) {
      chartType = 'bar';
    } else if (answer.includes('Area')) {
      chartType = 'area';
    }
    
    let config: AIWidgetConfig;
    
    if (firstAnswer.includes('Revenue Growth')) {
      config = {
        title: 'Revenue Growth Rate',
        description: 'Month-over-month revenue growth percentage',
        category: 'financial',
        chartType: chartType,
        metricId: 'revenue-growth-ai'
      };
    } else if (firstAnswer.includes('Gross Order Revenue')) {
      config = {
        title: 'Gross Order Revenue',
        description: 'Total revenue from all orders',
        category: 'financial',
        chartType: chartType,
        metricId: 'gross-revenue-ai'
      };
    } else if (firstAnswer.includes('Average Order Value')) {
      config = {
        title: 'Average Order Value',
        description: 'Mean revenue per order',
        category: 'financial',
        chartType: chartType,
        metricId: 'average-order-value-ai'
      };
    } else if (firstAnswer.includes('Delivery Time')) {
      config = {
        title: 'Average Delivery Time',
        description: 'Mean time from order to delivery',
        category: 'operational',
        chartType: chartType,
        metricId: 'delivery-time-ai'
      };
    } else if (firstAnswer.includes('Dasher Efficiency')) {
      config = {
        title: 'Dasher Efficiency Score',
        description: 'Delivery performance and efficiency rating',
        category: 'operational',
        chartType: chartType,
        metricId: 'dasher-efficiency-ai'
      };
    } else if (firstAnswer.includes('Satisfaction')) {
      config = {
        title: 'Customer Satisfaction Score',
        description: 'Overall customer satisfaction rating',
        category: 'customer-support',
        chartType: chartType,
        metricId: 'csat-score-ai'
      };
    } else {
      // Default fallback
      config = {
        title: 'Revenue Growth Rate',
        description: 'Month-over-month revenue growth percentage',
        category: 'financial',
        chartType: chartType,
        metricId: 'revenue-growth-ai'
      };
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Add Widget with AI
            </DialogTitle>
            <Badge variant="secondary" className="gap-1 text-xs">
              Recommended
            </Badge>
          </div>
          <DialogDescription>
            {mode === 'ai-input' && 'Describe the widget you want to create'}
            {mode === 'ai-processing' && 'AI is creating your widget...'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {mode === 'ai-input' && (
            <div className="flex flex-col gap-4 mt-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur-xl" />
                <div className="relative flex gap-2 p-1 bg-background rounded-lg border-2 border-primary/20 focus-within:border-primary/40 transition-colors">
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
                    className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    autoFocus
                  />
                  <Button 
                    onClick={handleSubmit}
                    disabled={!userInput.trim()}
                    className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    Create
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="border rounded-lg p-4 bg-muted/30">
                  <p className="text-sm mb-3">💡 <strong>Try asking:</strong></p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Show me revenue growth over time',
                      'Track customer satisfaction scores',
                      'Display delivery efficiency metrics',
                      'Monitor conversion rate trends'
                    ].map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setUserInput(example)}
                        className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 mt-4 pt-4 border-t">
                <Button 
                  variant="ghost" 
                  onClick={handleSwitchToManual}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                  size="sm"
                >
                  <List className="h-4 w-4" />
                  Browse categories manually
                </Button>
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {mode === 'ai-processing' && (
            <div className="flex flex-col gap-4 flex-1 overflow-hidden">
              {/* User Query Display */}
              <Card className="p-4 bg-primary/5 border-primary/20">
                <p className="text-sm">
                  <span className="text-muted-foreground">Your request:</span>{' '}
                  <span>{userInput}</span>
                </p>
              </Card>

              {/* AI Thought Process */}
              <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
                <AnimatePresence mode="popLayout">
                  {thoughtSteps.map((step) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-3"
                    >
                      <div className="shrink-0 mt-1">
                        {step.status === 'processing' ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm flex-1">{step.text}</p>
                    </motion.div>
                  ))}

                  {/* AI Questions */}
                  {questions.map((question) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-1.5 bg-blue-600 rounded-full shrink-0">
                            <MessageCircle className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">AI Assistant</p>
                            <p className="text-sm">{question.question}</p>
                          </div>
                        </div>
                        
                        {question.answered ? (
                          <div className="ml-9 p-3 bg-white dark:bg-gray-900 rounded-lg border shadow-sm">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                              <p className="text-sm">{question.answer}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="ml-9 space-y-2">
                            {question.options?.map((option, optIndex) => (
                              <Button
                                key={optIndex}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-left h-auto py-2.5 px-3 bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                                onClick={() => {
                                  if (question.id === 'q1') {
                                    handleQuestionAnswer(question.id, option);
                                  } else {
                                    handleSecondQuestionAnswer(question.id, option);
                                  }
                                }}
                                disabled={isProcessing}
                              >
                                <ArrowRight className="h-3.5 w-3.5 mr-2 shrink-0" />
                                <span className="text-xs">{option}</span>
                              </Button>
                            ))}
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}

                  {/* Final Widget Preview */}
                  {finalConfig && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-300 dark:border-green-700 shadow-lg">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-600 rounded-full shrink-0">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm">Widget Ready</h4>
                              <Sparkles className="h-3.5 w-3.5 text-green-600" />
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {finalConfig.description}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="secondary" className="gap-1">
                                {finalConfig.title}
                              </Badge>
                              <Badge variant="outline">{finalConfig.chartType} chart</Badge>
                              <Badge variant="outline" className="capitalize">{finalConfig.category}</Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={thoughtsEndRef} />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-2 pt-4 border-t">
                <div className="flex gap-2">
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
                    className="text-muted-foreground gap-1"
                    size="sm"
                  >
                    <List className="h-3.5 w-3.5" />
                    Switch to manual
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => onOpenChange(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  {finalConfig && (
                    <Button 
                      onClick={handleAddWidget}
                      className="gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Add Widget to Dashboard
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
