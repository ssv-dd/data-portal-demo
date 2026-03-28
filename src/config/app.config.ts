import type { UserRole } from '@/types';

export const appConfig = {
  /** Brand color — maps to CSS var --dd-primary */
  brandColor: '#FF3A00',

  /** Current user (will come from auth in production) */
  user: {
    name: 'Tony',
    role: 'business-executive' as UserRole,
  },

  /** External dashboard URLs */
  externalUrls: {
    companyDashboard: 'https://app.sigmacomputing.com/doordash/workbook/company-dashboard-clone-clone-1v3cQbtiMdsTvuRBLqYwBR',
    progressVsPlan: 'https://app.sigmacomputing.com/doordash/workbook/Progress-vs-Plan-Q1-26-Non-Live-6QudnUVKcXDBag3IBxuQsI',
    cpdProjector: 'https://app.sigmacomputing.com/doordash/workbook/CPD-Projector-YXzYhYvhHGQckbSJrQfmX?:nodeId=Miflz3J74p',
    companyWBR: 'https://app.sigmacomputing.com/doordash/workbook/company-dashboard',
  },

  /** Feature flags for progressive rollout */
  features: {
    smartHighlighting: true,
    aiOverview: true,
    scorecardCustomization: true,
  },
} as const;

/** Available domains for canvases */
export const canvasDomains = ['Logistics', 'Marketplace', 'Ads', 'DashPass', 'Finance', 'CX'] as const;

/** Domain badge color mapping */
export const domainColors: Record<string, string> = {
  Logistics: '#FF3A00',
  Marketplace: '#8B5CF6',
  Ads: '#06B6D4',
  DashPass: '#10B981',
  Finance: '#F59E0B',
  CX: '#EC4899',
};
