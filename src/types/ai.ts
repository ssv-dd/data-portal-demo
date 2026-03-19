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

export interface AIOverviewSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AIOverviewSettings;
  onSave: (settings: AIOverviewSettings) => void;
}

export interface AIOverviewKeyInsight {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface AIOverviewSource {
  name: string;
  type: 'table' | 'dashboard' | 'report';
  icon: React.ElementType;
  confidence: number;
}

export interface AIOverviewResponse {
  summary: string;
  keyInsights: AIOverviewKeyInsight[];
  chartData: Array<Record<string, unknown>>;
  segmentData: Array<{ segment: string; value: number }>;
  sources: AIOverviewSource[];
  reasoning: string[];
}

export interface AIOverviewSectionProps {
  query: string;
  onDiveDeeperClick: () => void;
}

export interface SuggestionChip {
  text: string;
  icon?: React.ReactNode;
}

export interface AIAssistantSidebarProps {
  title?: string;
  welcomeMessage?: string;
  suggestions?: SuggestionChip[];
}

export interface TextSelectionToolbarProps {
  onAskAI: (selectedText: string) => void;
  onComment: (selectedText: string) => void;
  containerRef: React.RefObject<HTMLElement>;
}

export interface AskAIPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedText: string;
  contextType: 'highlight' | 'concern';
  onSelectPrompt: (prompt: string, selectedText: string) => void;
}

export interface CommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedText: string;
  onSubmitComment: (comment: string, mentions: string[], selectedText: string) => void;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}
