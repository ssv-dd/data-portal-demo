import { LayoutDashboard, FileCode2, GitBranch, Database } from 'lucide-react';
import type { RecentWorkItem } from '@/app/components/home/recent-work-card';

export const recentWork: RecentWorkItem[] = [
  {
    id: '1',
    title: 'Q1 Operations Dashboard',
    meta: 'Last edited 2 hours ago',
    status: 'Draft',
    icon: LayoutDashboard,
    route: '/dashboard/draft',
  },
  {
    id: '2',
    title: 'Delivery Analysis Notebook',
    meta: 'Last edited yesterday',
    status: 'Published',
    icon: FileCode2,
    route: '/notebooks',
  },
  {
    id: '3',
    title: 'Customer Segmentation Workflow',
    meta: 'Last edited 3 days ago',
    status: 'Running',
    icon: GitBranch,
    route: '/ai-workflows',
  },
  {
    id: '4',
    title: 'Revenue Trends Query',
    meta: 'Last edited last week',
    status: 'Saved',
    icon: Database,
    route: '/sql-studio',
  },
];
