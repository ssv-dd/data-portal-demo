import { Database, FileText, GitBranch, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const knowledgeBases: KnowledgeBase[] = [
  {
    id: 'all',
    name: 'All Knowledge',
    description: 'Access to all available data sources and documentation',
    icon: Database,
    color: 'text-blue-600',
  },
  {
    id: 'sql',
    name: 'SQL & Data',
    description: 'Database schemas, query history, and data documentation',
    icon: Database,
    color: 'text-purple-600',
  },
  {
    id: 'dashboards',
    name: 'Dashboards',
    description: 'Dashboard templates, metrics catalog, and best practices',
    icon: BarChart3,
    color: 'text-green-600',
  },
  {
    id: 'workflows',
    name: 'Workflows',
    description: 'Workflow templates, node documentation, and automation guides',
    icon: GitBranch,
    color: 'text-orange-600',
  },
  {
    id: 'notebooks',
    name: 'Notebooks',
    description: 'Analysis templates, code snippets, and notebook examples',
    icon: FileText,
    color: 'text-indigo-600',
  },
];
