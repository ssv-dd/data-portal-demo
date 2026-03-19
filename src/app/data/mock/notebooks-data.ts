import type { Notebook } from '@/types';
import { BarChart3, Code, BookOpen } from 'lucide-react';

export const notebookTemplates = [
  {
    id: 'template_1',
    name: 'Feature Exploration',
    description: 'Explore feature distributions, correlations, and quality metrics',
    icon: BarChart3,
    cells: 8,
  },
  {
    id: 'template_2',
    name: 'Model Evaluation',
    description: 'Evaluate model performance with standard ML metrics',
    icon: Code,
    cells: 12,
  },
  {
    id: 'template_3',
    name: 'Data Quality Check',
    description: 'Run data quality checks and generate reports',
    icon: BookOpen,
    cells: 6,
  },
];

export const mockNotebooks: Notebook[] = [
  { id: '1', title: 'Courier Availability Analysis', description: 'Feature exploration & distribution for courier supply model', lastEdited: '2 hours ago', owner: 'S. Lee', shared: false, cells: 14, language: 'Python' },
  { id: '2', title: 'DashPass Retention Deep-Dive', description: 'Cohort analysis of DashPass subscriber retention', lastEdited: '5 hours ago', owner: 'Tony', shared: true, cells: 18, language: 'Python' },
  { id: '3', title: 'Merchant GMV Forecasting', description: 'Time-series forecasting for merchant gross merchandise value', lastEdited: '1 day ago', owner: 'A. Patel', shared: true, cells: 22, language: 'Python' },
  { id: '4', title: 'Delivery Time Optimization', description: 'Analysis of delivery time factors and bottlenecks', lastEdited: '2 days ago', owner: 'Tony', shared: false, cells: 16, language: 'Python' },
  { id: '5', title: 'New User Funnel Analysis', description: 'Conversion funnel from signup to first order', lastEdited: '3 days ago', owner: 'M. Chen', shared: true, cells: 10, language: 'SQL + Python' },
  { id: '6', title: 'Ad Attribution Model', description: 'Multi-touch attribution for marketing campaigns', lastEdited: '4 days ago', owner: 'Tony', shared: false, cells: 20, language: 'Python' },
];
