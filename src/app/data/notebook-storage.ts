import type { Notebook } from '@/types';
import { appConfig } from '@/config/app.config';
import { mockNotebooks } from './mock/notebooks-data';

const STORAGE_KEY = 'data-portal-notebooks';

function loadUserNotebooks(): Notebook[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserNotebooks(notebooks: Notebook[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks));
}

export function getAllNotebooks(): Notebook[] {
  const userCreated = loadUserNotebooks();
  return [...userCreated, ...mockNotebooks];
}

export function createNotebook(name: string, serverType: string, library: string): Notebook {
  const notebook: Notebook = {
    id: `nb-${Date.now()}`,
    title: name || 'Untitled Notebook',
    description: `${serverType} · ${library}`,
    lastEdited: 'Just now',
    owner: appConfig.user.name,
    shared: false,
    cells: 0,
    language: 'Python',
  };

  const existing = loadUserNotebooks();
  existing.unshift(notebook);
  saveUserNotebooks(existing);

  return notebook;
}

export function deleteNotebook(id: string): void {
  const existing = loadUserNotebooks();
  saveUserNotebooks(existing.filter((n) => n.id !== id));
}

const PREFILL_CELLS_KEY = 'data-portal-notebook-prefill';

export function setPrefillCells(cells: { type: 'code' | 'markdown'; source: string }[]): void {
  sessionStorage.setItem(PREFILL_CELLS_KEY, JSON.stringify(cells));
}

export function consumePrefillCells(): { type: 'code' | 'markdown'; source: string }[] | null {
  const raw = sessionStorage.getItem(PREFILL_CELLS_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PREFILL_CELLS_KEY);
  try { return JSON.parse(raw); } catch { return null; }
}
