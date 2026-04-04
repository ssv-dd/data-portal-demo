const PREFILL_KEY = 'data-portal-sql-prefill';

export interface SqlPrefill {
  tabName: string;
  sql: string;
  sourceLabel?: string;
}

export function setSqlPrefill(prefill: SqlPrefill): void {
  localStorage.setItem(PREFILL_KEY, JSON.stringify(prefill));
}

export function consumeSqlPrefill(): SqlPrefill | null {
  const raw = localStorage.getItem(PREFILL_KEY);
  if (!raw) return null;
  localStorage.removeItem(PREFILL_KEY);
  try { return JSON.parse(raw); } catch { return null; }
}
