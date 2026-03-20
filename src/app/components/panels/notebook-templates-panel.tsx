import { FileCode2, Clock, Users, Star } from 'lucide-react';
import { cn } from '../ui/utils';

interface NotebookItem {
  id: string;
  title: string;
  type: string;
  icon?: string;
}

interface NotebookTemplatesPanelProps {
  activeTab: string;
  onNotebookClick?: (notebook: NotebookItem) => void;
}

const recentNotebooks: NotebookItem[] = [
  { id: '1', title: 'Delivery Analysis', type: 'Last edited yesterday' },
  { id: '2', title: 'Customer Segmentation', type: 'Last edited 3 days ago' },
  { id: '3', title: 'Revenue Trends', type: 'Last edited last week' },
];

const templateNotebooks: NotebookItem[] = [
  { id: 't1', title: 'Exploratory Data Analysis', type: 'Template' },
  { id: 't2', title: 'Time Series Forecasting', type: 'Template' },
  { id: 't3', title: 'A/B Test Analysis', type: 'Template' },
];

const sharedNotebooks: NotebookItem[] = [
  { id: 's1', title: 'Q1 Performance Review', type: 'Shared by Analytics Team' },
  { id: 's2', title: 'Customer Churn Model', type: 'Shared by Data Science' },
];

export function NotebookTemplatesPanel({
  activeTab,
  onNotebookClick,
}: NotebookTemplatesPanelProps) {
  const getNotebooks = () => {
    switch (activeTab) {
      case 'recent':
        return recentNotebooks;
      case 'templates':
        return templateNotebooks;
      case 'shared':
        return sharedNotebooks;
      default:
        return recentNotebooks;
    }
  };

  const notebooks = getNotebooks();

  return (
    <div className="space-y-2">
      {notebooks.map((notebook) => (
        <button
          key={notebook.id}
          onClick={() => onNotebookClick?.(notebook)}
          className={cn(
            'w-full p-3 rounded-lg',
            'flex items-start gap-3',
            'bg-background/40 border border-border/40',
            'hover:bg-accent/60 hover:border-border/60',
            'transition-all duration-200',
            'group text-left'
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center flex-shrink-0">
            <FileCode2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {notebook.title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {notebook.type}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
