import type { Canvas } from '@/types';
import { appConfig } from '@/config/app.config';

const { name: owner } = appConfig.user;

export const mockCanvases: Canvas[] = [
  {
    id: '1',
    title: 'Q1 Operations Dashboard',
    description: 'Key operational metrics for Q1 review',
    lastEdited: '2 hours ago',
    metrics: 12,
    owner,
    shared: false,
  },
  {
    id: '2',
    title: 'Delivery Performance',
    description: 'Dasher and delivery latency metrics',
    lastEdited: '1 day ago',
    metrics: 8,
    owner,
    shared: true,
  },
  {
    id: '3',
    title: 'Customer Experience',
    description: 'CX metrics and NPS tracking',
    lastEdited: '3 days ago',
    metrics: 15,
    owner,
    shared: false,
  },
  {
    id: '4',
    title: 'DashPass Growth Tracker',
    description: 'Subscription growth, retention, and churn metrics',
    lastEdited: '5 hours ago',
    metrics: 9,
    owner,
    shared: true,
  },
  {
    id: '5',
    title: 'Marketplace Health',
    description: 'Supply/demand balance, merchant metrics, and order volume',
    lastEdited: '2 days ago',
    metrics: 18,
    owner,
    shared: false,
  },
  {
    id: '6',
    title: 'Weekly Business Review',
    description: 'WBR deck metrics: revenue, orders, new users, CSAT',
    lastEdited: '6 hours ago',
    metrics: 22,
    owner,
    shared: true,
  },
];
