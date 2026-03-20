import { GitBranch, Database, Filter, Zap, Mail, Webhook } from 'lucide-react';
import { cn } from '../ui/utils';
import type { LucideIcon } from 'lucide-react';

interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  icon: LucideIcon;
  description?: string;
}

interface WorkflowNodesPanelProps {
  activeTab: string;
  onNodeClick?: (node: WorkflowNode) => void;
}

const workflows: Array<{ id: string; name: string; status: string }> = [
  { id: 'w1', name: 'Customer Segmentation', status: 'Running' },
  { id: 'w2', name: 'Data Pipeline Sync', status: 'Idle' },
  { id: 'w3', name: 'Alert Notifications', status: 'Active' },
];

const nodes: WorkflowNode[] = [
  {
    id: 'n1',
    name: 'Data Source',
    type: 'Input',
    icon: Database,
    description: 'Connect to data source',
  },
  {
    id: 'n2',
    name: 'Filter',
    type: 'Transform',
    icon: Filter,
    description: 'Filter data rows',
  },
  {
    id: 'n3',
    name: 'AI Transform',
    type: 'AI',
    icon: Zap,
    description: 'Apply AI transformation',
  },
  {
    id: 'n4',
    name: 'Email Alert',
    type: 'Output',
    icon: Mail,
    description: 'Send email notification',
  },
  {
    id: 'n5',
    name: 'Webhook',
    type: 'Output',
    icon: Webhook,
    description: 'Trigger webhook',
  },
];

export function WorkflowNodesPanel({
  activeTab,
  onNodeClick,
}: WorkflowNodesPanelProps) {
  if (activeTab === 'workflows') {
    return (
      <div className="space-y-2">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className={cn(
              'p-3 rounded-lg',
              'bg-background/40 border border-border/40',
              'hover:bg-accent/60 hover:border-border/60',
              'transition-all duration-200'
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-medium text-foreground">{workflow.name}</p>
              <span
                className={cn(
                  'px-2 py-0.5 text-xs rounded-full',
                  workflow.status === 'Running'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : workflow.status === 'Active'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-muted/60 text-muted-foreground'
                )}
              >
                {workflow.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Nodes tab
  return (
    <div className="space-y-2">
      {nodes.map((node) => {
        const Icon = node.icon;
        return (
          <button
            key={node.id}
            onClick={() => onNodeClick?.(node)}
            className={cn(
              'w-full p-3 rounded-lg',
              'flex items-start gap-3',
              'bg-background/40 border border-border/40',
              'hover:bg-accent/60 hover:border-border/60',
              'transition-all duration-200',
              'group text-left'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dd-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-dd-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {node.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">{node.type}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
