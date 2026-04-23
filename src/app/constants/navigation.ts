import { BookOpen, Database, Home, LayoutDashboard, MessageSquare, Workflow } from 'lucide-react';

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: typeof Home;
  disabled?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', path: '/', icon: Home },
  { key: 'chat', label: 'Chat', path: '/chat', icon: MessageSquare },
  { key: 'dashboards', label: 'Dashboards', path: '/dashboards', icon: LayoutDashboard },
  { key: 'sql-studio', label: 'SQL Studio', path: '/sql-studio', icon: Database },
  { key: 'notebooks', label: 'Notebooks', path: '/notebooks', icon: BookOpen },
  { key: 'ai-workflows', label: 'AI Workflows', path: '/ai-workflows', icon: Workflow },
];

export const FOOTER_ITEMS: NavItem[] = [];
