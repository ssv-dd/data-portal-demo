import { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Copy, Edit, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  steps?: Array<{
    type: string;
    label: string;
    completed: boolean;
  }>;
  takeaways?: string[];
}

export function AIAgentSidebar({ title = 'AI Assistant' }: { title?: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'user',
      content: 'Use prophet and prepare a strong data science forecast for what revenues will look like for us over the next 8 quarters please'
    },
    {
      role: 'assistant',
      content: "I'll create a comprehensive revenue forecast using Prophet for the next 8 quarters. Let me start by exploring the data and then build the forecast model.",
      steps: [
        { type: 'Scratchpad SQL', label: 'Scratchpad SQL', completed: true },
        { type: 'Markdown', label: 'Markdown', completed: true },
        { type: 'SQL', label: 'SQL', completed: true },
        { type: 'Python', label: 'Python', completed: true },
        { type: 'Markdown', label: 'Markdown', completed: true },
        { type: 'Python', label: 'Python', completed: true },
        { type: 'Visualisation', label: 'Visualisation', completed: true },
        { type: 'Markdown', label: 'Markdown', completed: true },
        { type: 'Visualisation', label: 'Visualisation', completed: true },
        { type: 'Visualisation', label: 'Visualisation', completed: true },
      ],
      takeaways: [
        'Total forecasted revenue of $216.8M across Q1 2026 - Q4 2027',
        'Steady 7.3% year-over-year growth from 2026 to 2027',
        'Strong seasonal patterns with Q2 peaks ($29.8M avg) and Q3 lulls ($25.2M avg)',
        'Wide confidence intervals reflecting natural revenue volatility'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { role: 'user', content: inputValue }]);
      setInputValue('');
    }
  };

  return (
    <>
      {/* Toggle Button (when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-white border border-l-0 border-gray-200 rounded-l-lg p-2 shadow-lg hover:bg-gray-50 transition-colors z-40"
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-16 bottom-0 bg-white border-l border-gray-200 shadow-xl transition-transform duration-300 ease-in-out z-30 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '420px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: '#FF3A00' }} />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              {message.role === 'user' ? (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-900">{message.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">{message.content}</p>
                  
                  {/* Steps */}
                  {message.steps && (
                    <div className="space-y-1.5">
                      {message.steps.map((step, stepIndex) => (
                        <div
                          key={stepIndex}
                          className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 border border-gray-200"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm text-gray-700">{step.label}</span>
                          </div>
                          {step.completed && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Takeaways */}
                  {message.takeaways && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Key Takeaways:</p>
                      <ul className="space-y-1.5 ml-1">
                        {message.takeaways.map((takeaway, takeawayIndex) => (
                          <li key={takeawayIndex} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-gray-400">•</span>
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button className="text-gray-400 hover:text-gray-600 transition-colors mt-2">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="relative">
            <Input
              placeholder="Prompt to explore your data..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              className="pr-24 border-gray-300"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="6" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" className="text-gray-400" />
                  <path d="M5 6V4C5 2.89543 5.89543 2 7 2H9C10.1046 2 11 2.89543 11 4V6" stroke="currentColor" strokeWidth="1.5" className="text-gray-400" />
                </svg>
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" className="text-gray-400" />
                  <path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-400" />
                </svg>
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="1.5" fill="currentColor" className="text-gray-400" />
                  <path d="M8 3V5M8 11V13M13 8H11M5 8H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-400" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}