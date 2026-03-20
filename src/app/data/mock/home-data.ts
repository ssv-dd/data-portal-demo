import { LayoutDashboard, TrendingUp, FileText, BarChart3, Database, FileCode2, GitBranch } from 'lucide-react';
import type { DiscoveryItem } from '@/app/components/home/discovery-card';
import type { CreateAction } from '@/app/components/home/create-card';

export const recommendations = [
  { id: 'rec-1', title: 'Company Dashboard', reason: 'Most viewed dashboard by your team this week — 23 views across leadership', type: 'Dashboard' },
  { id: 'rec-2', title: 'Progress vs Plan Q1\'26', reason: 'Referenced in 3 recent Slack threads by your direct reports', type: 'Dashboard' },
  { id: 'rec-3', title: 'DashPass Retention Deep Dive', reason: 'Related to your recent query about subscription churn trends', type: 'Analysis' },
  { id: 'rec-4', title: 'Cx Marketplace Cohort Analysis', reason: 'Trending across S&O — 15 unique viewers in the last 7 days', type: 'Report' },
];

export const favoriteAssets = [
  { id: 'fav-1', name: 'Weekly KPI Tracker', type: 'Dashboard', icon: '📊' },
  { id: 'fav-2', name: 'fact_order_delivery', type: 'Table', icon: '🗃️' },
  { id: 'fav-3', name: 'Cx Retention Model', type: 'Notebook', icon: '📓' },
  { id: 'fav-4', name: 'Revenue Forecast Q1', type: 'Dashboard', icon: '📈' },
];

export const discoveryFeed = {
  recommendations: [
    {
      id: 'disc-rec-1',
      title: 'Company Dashboard',
      description: 'Most viewed dashboard by your team this week — 23 views across leadership',
      icon: LayoutDashboard,
      category: 'Dashboard',
      route: '/dashboards',
    },
    {
      id: 'disc-rec-2',
      title: 'Progress vs Plan Q1\'26',
      description: 'Referenced in 3 recent Slack threads by your direct reports',
      icon: TrendingUp,
      category: 'Dashboard',
      route: '/dashboards',
    },
    {
      id: 'disc-rec-3',
      title: 'DashPass Retention Deep Dive',
      description: 'Related to your recent query about subscription churn trends',
      icon: BarChart3,
      category: 'Analysis',
      route: '/dashboards',
    },
    {
      id: 'disc-rec-4',
      title: 'Cx Marketplace Cohort Analysis',
      description: 'Trending across S&O — 15 unique viewers in the last 7 days',
      icon: FileText,
      category: 'Report',
      route: '/dashboards',
    },
  ] as DiscoveryItem[],
  favorites: [
    {
      id: 'disc-fav-1',
      title: 'Weekly KPI Tracker',
      description: 'Your go-to dashboard for executive metrics and performance tracking',
      icon: LayoutDashboard,
      category: 'Dashboard',
      route: '/dashboards',
    },
    {
      id: 'disc-fav-2',
      title: 'fact_order_delivery',
      description: 'Core order delivery facts table with 2.5B+ records',
      icon: Database,
      category: 'Table',
      route: '/sql-studio',
    },
    {
      id: 'disc-fav-3',
      title: 'Cx Retention Model',
      description: 'Customer retention analysis notebook with ML predictions',
      icon: FileCode2,
      category: 'Notebook',
      route: '/notebooks',
    },
  ] as DiscoveryItem[],
  recent: [
    {
      id: 'disc-rec-1',
      title: 'Q1 Operations Dashboard',
      description: 'Last edited 2 hours ago by you',
      icon: LayoutDashboard,
      category: 'Dashboard',
      route: '/dashboard/draft',
    },
    {
      id: 'disc-rec-2',
      title: 'Delivery Analysis Notebook',
      description: 'Last edited yesterday, 3 collaborators',
      icon: FileCode2,
      category: 'Notebook',
      route: '/notebooks',
    },
    {
      id: 'disc-rec-3',
      title: 'Revenue Trends Query',
      description: 'Last edited last week',
      icon: Database,
      category: 'SQL Query',
      route: '/sql-studio',
    },
  ] as DiscoveryItem[],
};

export const createActions: CreateAction[] = [
  {
    id: 'create-dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    route: '/dashboard/draft',
  },
  {
    id: 'create-query',
    label: 'SQL Query',
    icon: Database,
    route: '/sql-studio',
  },
  {
    id: 'create-notebook',
    label: 'Notebook',
    icon: FileCode2,
    route: '/notebooks',
  },
  {
    id: 'create-workflow',
    label: 'AI Workflow',
    icon: GitBranch,
    route: '/ai-workflows',
  },
];
