import type { Canvas, WidgetConfig } from '@/types';
import { appConfig } from '@/config/app.config';

const CANVASES_KEY = 'data-portal-canvases';
const WIDGETS_KEY_PREFIX = 'data-portal-canvas-widgets-';
const MIGRATION_KEY = 'data-portal-widget-types-migrated';

function migrateWidgetTypes(): void {
  if (localStorage.getItem(MIGRATION_KEY)) return;
  const canvases: Canvas[] = JSON.parse(localStorage.getItem(CANVASES_KEY) ?? '[]');
  for (const canvas of canvases) {
    const widgetsRaw = localStorage.getItem(WIDGETS_KEY_PREFIX + canvas.id);
    if (!widgetsRaw) continue;
    const widgets = JSON.parse(widgetsRaw) as any[];
    let changed = false;
    for (const w of widgets) {
      if (w.type === 'bar') { w.type = 'column'; changed = true; }
      if (w.type === 'pie') { w.type = 'donut'; changed = true; }
    }
    if (changed) {
      localStorage.setItem(WIDGETS_KEY_PREFIX + canvas.id, JSON.stringify(widgets));
    }
  }
  localStorage.setItem(MIGRATION_KEY, 'true');
}

function generateId(): string {
  return crypto.randomUUID();
}

export function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(isoString).toLocaleDateString();
}

const SEED_CANVASES: Canvas[] = [
  {
    id: generateId(),
    title: 'Q1 Operations Dashboard',
    description: 'Key operational metrics for Q1 review',
    domain: 'Logistics',
    tier: 'T1',
    status: 'published',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    lastEdited: new Date(Date.now() - 2 * 3600000).toISOString(),
    owner: appConfig.user.name,
    shared: false,
    layout: [],
  },
  {
    id: generateId(),
    title: 'Delivery Performance',
    description: 'Dasher and delivery latency metrics',
    domain: 'Logistics',
    tier: 'T2',
    status: 'published',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    lastEdited: new Date(Date.now() - 86400000).toISOString(),
    owner: appConfig.user.name,
    shared: true,
    layout: [],
  },
  {
    id: generateId(),
    title: 'Customer Experience',
    description: 'CX metrics and NPS tracking',
    domain: 'CX',
    tier: 'T1',
    status: 'draft',
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
    lastEdited: new Date(Date.now() - 3 * 86400000).toISOString(),
    owner: appConfig.user.name,
    shared: false,
    layout: [],
  },
  {
    id: generateId(),
    title: 'DashPass Growth Tracker',
    description: 'Subscription growth, retention, and churn metrics',
    domain: 'DashPass',
    tier: 'T1',
    status: 'published',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    lastEdited: new Date(Date.now() - 5 * 3600000).toISOString(),
    owner: appConfig.user.name,
    shared: true,
    layout: [],
  },
  {
    id: generateId(),
    title: 'Marketplace Health',
    description: 'Supply/demand balance, merchant metrics, and order volume',
    domain: 'Marketplace',
    tier: 'T2',
    status: 'draft',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastEdited: new Date(Date.now() - 2 * 86400000).toISOString(),
    owner: appConfig.user.name,
    shared: false,
    layout: [],
  },
  {
    id: generateId(),
    title: 'Weekly Business Review',
    description: 'WBR deck metrics: revenue, orders, new users, CSAT',
    domain: 'Finance',
    tier: 'T0',
    status: 'published',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    lastEdited: new Date(Date.now() - 6 * 3600000).toISOString(),
    owner: appConfig.user.name,
    shared: true,
    layout: [],
  },
];

function seedIfEmpty(): void {
  const raw = localStorage.getItem(CANVASES_KEY);
  if (!raw) {
    localStorage.setItem(CANVASES_KEY, JSON.stringify(SEED_CANVASES));
  }
}

export const canvasStorage = {
  getCanvases(): Canvas[] {
    seedIfEmpty();
    const raw = localStorage.getItem(CANVASES_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getCanvas(id: string): Canvas | null {
    const canvases = this.getCanvases();
    return canvases.find((c) => c.id === id) ?? null;
  },

  saveCanvas(canvas: Canvas): void {
    const canvases = this.getCanvases();
    const idx = canvases.findIndex((c) => c.id === canvas.id);
    if (idx >= 0) {
      canvases[idx] = { ...canvas, lastEdited: new Date().toISOString() };
    } else {
      canvases.push(canvas);
    }
    localStorage.setItem(CANVASES_KEY, JSON.stringify(canvases));
  },

  deleteCanvas(id: string): void {
    const canvases = this.getCanvases().filter((c) => c.id !== id);
    localStorage.setItem(CANVASES_KEY, JSON.stringify(canvases));
    localStorage.removeItem(WIDGETS_KEY_PREFIX + id);
  },

  getCanvasWidgets(canvasId: string): WidgetConfig[] {
    migrateWidgetTypes();
    const raw = localStorage.getItem(WIDGETS_KEY_PREFIX + canvasId);
    return raw ? JSON.parse(raw) : [];
  },

  saveCanvasWidget(canvasId: string, widget: WidgetConfig): void {
    const widgets = this.getCanvasWidgets(canvasId);
    const idx = widgets.findIndex((w) => w.id === widget.id);
    if (idx >= 0) {
      widgets[idx] = widget;
    } else {
      widgets.push(widget);
    }
    localStorage.setItem(WIDGETS_KEY_PREFIX + canvasId, JSON.stringify(widgets));
  },

  removeCanvasWidget(canvasId: string, widgetId: string): void {
    const widgets = this.getCanvasWidgets(canvasId).filter((w) => w.id !== widgetId);
    localStorage.setItem(WIDGETS_KEY_PREFIX + canvasId, JSON.stringify(widgets));
  },

  generateId,
  formatRelativeTime,
};
