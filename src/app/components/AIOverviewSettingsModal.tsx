import { useState } from 'react';
import { Button } from './ui/button';
import {
  Settings,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export interface AIOverviewSettings {
  autoSync: boolean;
  detailLevel: 'summary' | 'balanced' | 'detailed';
  focusAreas: {
    goalProgress: boolean;
    anomalies: boolean;
    weekOverWeek: boolean;
    monthOverMonth: boolean;
    recommendations: boolean;
    crossMetricCorrelations: boolean;
  };
}

interface AIOverviewSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AIOverviewSettings;
  onSave: (settings: AIOverviewSettings) => void;
}

export const defaultAIOverviewSettings: AIOverviewSettings = {
  autoSync: true,
  detailLevel: 'balanced',
  focusAreas: {
    goalProgress: true,
    anomalies: true,
    weekOverWeek: true,
    monthOverMonth: false,
    recommendations: true,
    crossMetricCorrelations: false,
  },
};

export function AIOverviewSettingsModal({ 
  isOpen, 
  onClose, 
  currentSettings,
  onSave 
}: AIOverviewSettingsModalProps) {
  const [settings, setSettings] = useState<AIOverviewSettings>(currentSettings);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSave = () => {
    onSave(settings);
    toast.success('AI Overview settings saved');
    onClose();
  };

  const handleToggleFocusArea = (area: keyof typeof settings.focusAreas) => {
    setSettings(prev => ({
      ...prev,
      focusAreas: {
        ...prev.focusAreas,
        [area]: !prev.focusAreas[area]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white dark:bg-foreground/5 rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold">AI Overview Settings</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4">
            {/* Auto-Sync */}
            <div>
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setSettings(prev => ({ ...prev, autoSync: !prev.autoSync }))}
                  className="shrink-0 mt-0.5"
                >
                  {settings.autoSync ? (
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-border" />
                  )}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground dark:text-foreground">
                    Auto-sync with my scorecard
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground/60 mt-1">
                    Show insights for selected metrics only
                  </p>
                </div>
              </div>

              {settings.autoSync && (
                <div className="ml-8 mt-2 p-2 rounded bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-900 dark:text-green-200 flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" />
                    <span>Recommended for most users. AI will automatically focus on your selected metrics.</span>
                  </p>
                </div>
              )}
            </div>

            {/* Advanced Settings Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full text-left p-3 rounded-xl border border-border/60 dark:border-border hover:bg-accent/40 dark:hover:bg-accent/40 transition-colors"
            >
              <p className="text-sm font-medium text-foreground dark:text-muted-foreground flex items-center gap-2">
                Advanced {showAdvanced ? '▼' : '▶'}
              </p>
            </button>

            {/* Advanced Settings */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Detail Level */}
                  <div>
                    <p className="text-sm font-medium text-foreground dark:text-muted-foreground mb-2">
                      Detail Level:
                    </p>
                    <div className="space-y-2">
                      {[
                        { value: 'summary', label: 'Executive Summary', desc: '3-4 bullet points' },
                        { value: 'balanced', label: 'Balanced', desc: 'Current default view' },
                        { value: 'detailed', label: 'Detailed Analysis', desc: 'Expanded explanations' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSettings(prev => ({ ...prev, detailLevel: option.value as any }))}
                          className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all ${
                            settings.detailLevel === option.value
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
                              : 'border-border/60 dark:border-border hover:bg-accent/40 dark:hover:bg-accent/40'
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {settings.detailLevel === option.value ? (
                              <CheckCircle2 className="h-5 w-5 text-purple-600" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-border" />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-foreground dark:text-foreground">
                              {option.label}
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-muted-foreground/60">
                              {option.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Focus Areas */}
                  <div>
                    <p className="text-sm font-medium text-foreground dark:text-muted-foreground mb-2">
                      Focus on:
                    </p>
                    <div className="space-y-2">
                      {[
                        { key: 'goalProgress', label: 'Goal progress', desc: 'Track vs targets' },
                        { key: 'anomalies', label: 'Anomalies', desc: 'Unusual patterns' },
                        { key: 'weekOverWeek', label: 'Week-over-week changes', desc: 'WoW trends' },
                        { key: 'monthOverMonth', label: 'Month-over-month changes', desc: 'MoM trends' },
                        { key: 'recommendations', label: 'AI recommendations', desc: 'Next actions' },
                        { key: 'crossMetricCorrelations', label: 'Cross-metric correlations', desc: 'Related patterns' },
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => handleToggleFocusArea(option.key as any)}
                          className="w-full flex items-start gap-3 p-2 rounded hover:bg-accent/40 dark:hover:bg-accent/40 transition-colors text-left"
                        >
                          <div className="shrink-0 mt-0.5">
                            {settings.focusAreas[option.key as keyof typeof settings.focusAreas] ? (
                              <CheckCircle2 className="h-4 w-4 text-purple-600" />
                            ) : (
                              <div className="h-4 w-4 rounded border-2 border-border" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground dark:text-foreground">
                              {option.label}
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-muted-foreground/60">
                              {option.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-muted/50 dark:bg-muted/50 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              Apply
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
