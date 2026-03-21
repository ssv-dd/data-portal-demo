import { LayoutDashboard, TrendingUp, FileText, BarChart3, Database, FileCode2, GitBranch } from 'lucide-react';
import type { DiscoveryItem } from '@/app/components/home/discovery-card';
import type { QuickAction } from '@/app/components/home/your-work-card';

export const discoveryFeed = {
  team: [
    {
      id: 'team-1',
      title: 'Company Dashboard',
      description: '23 views by your team this week — most viewed across leadership',
      icon: LayoutDashboard,
      category: 'Dashboard',
      route: '/dashboards',
    },
    {
      id: 'team-2',
      title: 'Progress vs Plan Q1\'26',
      description: 'Referenced in 3 Slack threads by your direct reports',
      icon: TrendingUp,
      category: 'Dashboard',
      route: '/dashboards',
    },
    {
      id: 'team-3',
      title: 'DashPass Retention Deep Dive',
      description: 'Shared by Priya S. with your pod yesterday',
      icon: BarChart3,
      category: 'Analysis',
      route: '/dashboards',
    },
    {
      id: 'team-4',
      title: 'Cx Marketplace Cohort Analysis',
      description: 'Viewed by 5 people in your org today',
      icon: FileText,
      category: 'Report',
      route: '/dashboards',
    },
  ] as DiscoveryItem[],
  trending: [
    {
      id: 'trend-1',
      title: 'Cx Marketplace Cohort Analysis',
      description: '15 unique viewers in last 7 days — trending across S&O',
      icon: FileText,
      category: 'Report',
      route: '/dashboards',
    },
    {
      id: 'trend-2',
      title: 'DashPass Growth Model',
      description: '42 views this week, up 3x from last week',
      icon: TrendingUp,
      category: 'Notebook',
      route: '/notebooks',
    },
    {
      id: 'trend-3',
      title: 'Merchant Quality Scorecard',
      description: 'Viewed by 8 teams in the last 3 days',
      icon: BarChart3,
      category: 'Dashboard',
      route: '/dashboards',
    },
    {
      id: 'trend-4',
      title: 'Logistics Cost Optimization',
      description: '28 views this week, up 2x from last week',
      icon: TrendingUp,
      category: 'Analysis',
      route: '/dashboards',
    },
  ] as DiscoveryItem[],
  recent: [
    {
      id: 'new-1',
      title: 'Q1 Ads Revenue Dashboard',
      description: 'Published 2 hours ago by Harsha K.',
      icon: LayoutDashboard,
      category: 'Dashboard',
      route: '/dashboards',
    },
    {
      id: 'new-2',
      title: 'Delivery ETA Prediction Model v3',
      description: 'Published yesterday by ML Platform team',
      icon: FileCode2,
      category: 'Notebook',
      route: '/notebooks',
    },
    {
      id: 'new-3',
      title: 'fact_subscription_events',
      description: 'New table added 3 days ago — DashPass domain',
      icon: Database,
      category: 'Table',
      route: '/sql-studio',
    },
    {
      id: 'new-4',
      title: 'Dasher Earnings Forecast',
      description: 'Published 4 days ago by Dasher Ops team',
      icon: BarChart3,
      category: 'Dashboard',
      route: '/dashboards',
    },
  ] as DiscoveryItem[],
};

export const quickActions: QuickAction[] = [
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
    label: 'Workflow',
    icon: GitBranch,
    route: '/ai-workflows',
  },
];
