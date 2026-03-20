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
