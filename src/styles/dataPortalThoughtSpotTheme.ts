/**
 * Bridges the app's --app-* CSS variables (from dataPortalAppSurface.ts) into
 * ThoughtSpot's --ts-var-* CSS variables.
 *
 * Architecture (follows the same pattern as Prism overrides):
 *
 *   dataPortalAppSurface.ts   ← defines --app-* (light + dark)
 *         ↓
 *   dataPortalThoughtSpotTheme.ts  ← maps --app-* → --ts-var-*
 *         ↓
 *   ThoughtSpot embeds receive resolved color values via customizations
 *
 * ThoughtSpot embeds live in a separate iframe and cannot read the host's CSS
 * variables, so we resolve them to concrete values via getComputedStyle at
 * config time. This keeps both light and dark mode in sync automatically — no
 * duplicated hex values.
 *
 * When the theme toggles, DashboardsPage recomputes the embed config via
 * useMemo (keyed on isDark), which calls these functions again with the
 * updated computed style values.
 */

// const resolveVar = (name: string): string =>
//   getComputedStyle(document.documentElement).getPropertyValue(name).trim()
//
// const APP_FONT_FAMILY = [
//   'DD-TTNorms',
//   '-apple-system',
//   'BlinkMacSystemFont',
//   '"Segoe UI"',
//   'Roboto',
//   'Helvetica',
//   'Arial',
//   'sans-serif',
//   '"Apple Color Emoji"',
//   '"Segoe UI Emoji"',
//   '"Segoe UI Symbol"',
// ].join(', ')

/**
 * CSS overrides injected into the ThoughtSpot iframe via rules_UNSTABLE.
 * Only used when the official --ts-var-* API doesn't cover a surface.
 */
export const resolveThoughtSpotCssOverrides = (_isDark: boolean): Record<string, Record<string, string>> => ({
  // ThoughtSpot branding — hidden to match host app chrome
  '.powered-by-ts': { display: 'none' },
  '.embedV2PoweredByContainer': { display: 'none' },
  '.embed-module__footerWrapper': { display: 'none' },

  // Liveboard embed — hide the filter carousel and the pinboard embed
  // header. The tab panel is preserved (controlled via hideTabPanel={false}
  // on the LiveboardEmbed component). No --ts-var-* variables exist for
  // these elements. Attribute selectors avoid breakage from hash changes.
  '[class*="pinboardFilterCarousel"]': {
    display: 'none',
  },
  '[class*="pinboard-header-module__headerSticky"]': {
    display: 'none !important',
  },
  '[class*="pinboardLbEmbedHeader"]': {
    display: 'none !important',
  },
})

/**
 * Maps every relevant --app-* token to a ThoughtSpot --ts-var-* variable.
 *
 * Grouped by surface so additions/audits are straightforward. The full list
 * of supported variables lives in the SDK at
 * @thoughtspot/visual-embed-sdk/src/css-variables.ts
 *
 * DISABLED: All --ts-var-* color/theme mappings are commented out for now.
 * To re-enable, uncomment resolveVar + APP_FONT_FAMILY above, then
 * uncomment the body below and remove the empty return.
 */
export const resolveThoughtSpotThemeVariables = (): Record<string, string> => ({})

// ── Commented-out theme variable mappings ──────────────────────────────────
// Uncomment the block above → replace `({})` with the body below.
//
// export const resolveThoughtSpotThemeVariables = (): Record<string, string> => ({
//   // ── Root surfaces ────────────────────────────────────────────────────────
//   '--ts-var-root-background': resolveVar('--app-bg'),
//   '--ts-var-root-color': resolveVar('--app-fg'),
//   '--ts-var-root-font-family': APP_FONT_FAMILY,
//   '--ts-var-application-color': resolveVar('--app-dd-primary'),
//
//   // ── Navigation bar ──────────────────────────────────────────────────────
//   '--ts-var-nav-background': resolveVar('--app-bg-secondary'),
//   '--ts-var-nav-color': resolveVar('--app-fg'),
//
//   // ── Visualizations ──────────────────────────────────────────────────────
//   '--ts-var-viz-background': resolveVar('--app-card'),
//   '--ts-var-viz-title-color': resolveVar('--app-fg'),
//   '--ts-var-viz-description-color': resolveVar('--app-muted-fg'),
//   '--ts-var-viz-border-radius': '12px',
//   '--ts-var-viz-box-shadow': '0 1px 3px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)',
//   '--ts-var-viz-legend-hover-background': resolveVar('--app-secondary'),
//
//   // ── Liveboard layout ────────────────────────────────────────────────────
//   '--ts-var-liveboard-layout-background': resolveVar('--app-bg'),
//   '--ts-var-liveboard-header-background': resolveVar('--app-bg'),
//   '--ts-var-liveboard-header-font-color': resolveVar('--app-fg'),
//   '--ts-var-liveboard-edit-bar-background': resolveVar('--app-card'),
//   '--ts-var-liveboard-cross-filter-layout-background': resolveVar('--app-bg-secondary'),
//
//   // ── Liveboard tiles ─────────────────────────────────────────────────────
//   '--ts-var-liveboard-tile-background': resolveVar('--app-card'),
//   '--ts-var-liveboard-tile-border-color': resolveVar('--app-border'),
//   '--ts-var-liveboard-tile-border-radius': '12px',
//   '--ts-var-liveboard-tile-table-header-background': resolveVar('--app-secondary'),
//
//   // ── Liveboard tabs ──────────────────────────────────────────────────────
//   '--ts-var-liveboard-tab-active-border-color': resolveVar('--app-dd-primary'),
//   '--ts-var-liveboard-tab-hover-color': resolveVar('--app-fg'),
//
//   // ── Liveboard notes ─────────────────────────────────────────────────────
//   '--ts-var-liveboard-notetitle-heading-font-color': resolveVar('--app-fg'),
//   '--ts-var-liveboard-notetitle-body-font-color': resolveVar('--app-muted-fg'),
//
//   // ── Liveboard header action buttons ─────────────────────────────────────
//   '--ts-var-liveboard-header-action-button-background': 'transparent',
//   '--ts-var-liveboard-header-action-button-font-color': resolveVar('--app-muted-fg'),
//   '--ts-var-liveboard-header-action-button-hover-color': resolveVar('--app-fg'),
//   '--ts-var-liveboard-header-action-button-active-color': resolveVar('--app-fg'),
//
//   // ── Liveboard header badges ─────────────────────────────────────────────
//   '--ts-var-liveboard-header-badge-background': resolveVar('--app-secondary'),
//   '--ts-var-liveboard-header-badge-font-color': resolveVar('--app-fg'),
//   '--ts-var-liveboard-header-badge-modified-background': resolveVar('--app-accent'),
//   '--ts-var-liveboard-header-badge-modified-font-color': resolveVar('--app-fg'),
//   '--ts-var-liveboard-header-badge-hover-color': resolveVar('--app-fg'),
//   '--ts-var-liveboard-header-badge-active-color': resolveVar('--app-fg'),
//
//   // ── Filter chips ────────────────────────────────────────────────────────
//   '--ts-var-chip-background': resolveVar('--app-secondary'),
//   '--ts-var-chip-color': resolveVar('--app-fg'),
//   '--ts-var-chip--hover-background': resolveVar('--app-accent'),
//   '--ts-var-chip--hover-color': resolveVar('--app-fg'),
//   '--ts-var-chip--active-background': resolveVar('--app-accent'),
//   '--ts-var-chip--active-color': resolveVar('--app-fg'),
//
//   // ── Liveboard-scoped filter chips (requires isLiveboardStylingAndGrouping) ──
//   '--ts-var-liveboard-chip-background': resolveVar('--app-secondary'),
//   '--ts-var-liveboard-chip-color': resolveVar('--app-fg'),
//   '--ts-var-liveboard-chip--hover-background': resolveVar('--app-accent'),
//   '--ts-var-liveboard-chip--active-background': resolveVar('--app-accent'),
//
//   // ── Parameter chips ─────────────────────────────────────────────────────
//   '--ts-var-parameter-chip-background': resolveVar('--app-secondary'),
//   '--ts-var-parameter-chip-text-color': resolveVar('--app-fg'),
//   '--ts-var-parameter-chip-hover-background': resolveVar('--app-accent'),
//   '--ts-var-parameter-chip-hover-text-color': resolveVar('--app-fg'),
//   '--ts-var-parameter-chip-active-background': resolveVar('--app-accent'),
//   '--ts-var-parameter-chip-active-text-color': resolveVar('--app-fg'),
//
//   // ── Search bar ──────────────────────────────────────────────────────────
//   '--ts-var-search-data-button-background': resolveVar('--app-dd-primary'),
//   '--ts-var-search-data-button-font-color': resolveVar('--app-dd-primary-fg'),
//   '--ts-var-search-bar-background': resolveVar('--app-input-bg'),
//   '--ts-var-search-bar-text-font-color': resolveVar('--app-fg'),
//   '--ts-var-search-auto-complete-background': resolveVar('--app-card'),
//   '--ts-var-search-auto-complete-font-color': resolveVar('--app-fg'),
//   '--ts-var-search-auto-complete-subtext-font-color': resolveVar('--app-muted-fg'),
//   '--ts-var-search-bar-auto-complete-hover-background': resolveVar('--app-secondary'),
//   '--ts-var-search-navigation-button-background': resolveVar('--app-secondary'),
//   '--ts-var-search-bar-navigation-help-text-background': resolveVar('--app-secondary'),
//
//   // ── Spotter (AI assistant) ──────────────────────────────────────────────
//   '--ts-var-spotter-input-background': resolveVar('--app-input-bg'),
//   '--ts-var-spotter-prompt-background': resolveVar('--app-secondary'),
//
//   // ── Menus & dropdowns ───────────────────────────────────────────────────
//   '--ts-var-menu-background': resolveVar('--app-card'),
//   '--ts-var-menu-color': resolveVar('--app-fg'),
//   '--ts-var-menu--hover-background': resolveVar('--app-secondary'),
//   '--ts-var-menu-selected-text-color': resolveVar('--app-dd-primary'),
//
//   // ── Lists (filter panels, column pickers) ───────────────────────────────
//   '--ts-var-list-selected-background': resolveVar('--app-accent'),
//   '--ts-var-list-hover-background': resolveVar('--app-secondary'),
//
//   // ── Segment control (tab-like switchers) ────────────────────────────────
//   '--ts-var-segment-control-hover-background': resolveVar('--app-secondary'),
//
//   // ── Dialogs / popups ────────────────────────────────────────────────────
//   '--ts-var-dialog-body-background': resolveVar('--app-card'),
//   '--ts-var-dialog-body-color': resolveVar('--app-fg'),
//   '--ts-var-dialog-header-background': resolveVar('--app-bg'),
//   '--ts-var-dialog-header-color': resolveVar('--app-fg'),
//   '--ts-var-dialog-footer-background': resolveVar('--app-card'),
//
//   // ── Answer / edit panels ────────────────────────────────────────────────
//   '--ts-var-answer-data-panel-background-color': resolveVar('--app-card'),
//   '--ts-var-answer-edit-panel-background-color': resolveVar('--app-card'),
//   '--ts-var-answer-view-table-chart-switcher-background': resolveVar('--app-secondary'),
//   '--ts-var-answer-view-table-chart-switcher-active-background': resolveVar('--app-accent'),
//   '--ts-var-answer-chart-select-background': resolveVar('--app-accent'),
//   '--ts-var-answer-chart-hover-background': resolveVar('--app-secondary'),
//
//   // ── Buttons ─────────────────────────────────────────────────────────────
//   '--ts-var-button--primary-background': resolveVar('--app-dd-primary'),
//   '--ts-var-button--primary-color': resolveVar('--app-dd-primary-fg'),
//   '--ts-var-button--primary--hover-background': resolveVar('--app-dd-primary'),
//   '--ts-var-button--primary--active-background': resolveVar('--app-dd-primary'),
//   '--ts-var-button--secondary-background': resolveVar('--app-secondary'),
//   '--ts-var-button--secondary-color': resolveVar('--app-fg'),
//   '--ts-var-button--secondary--hover-background': resolveVar('--app-accent'),
//   '--ts-var-button--secondary--active-background': resolveVar('--app-accent'),
//   '--ts-var-button--tertiary-background': 'transparent',
//   '--ts-var-button--tertiary-color': resolveVar('--app-muted-fg'),
//   '--ts-var-button--tertiary--hover-background': resolveVar('--app-secondary'),
//   '--ts-var-button--tertiary--active-background': resolveVar('--app-secondary'),
//
//   // ── Checkboxes (filter panels, column selectors) ────────────────────────
//   '--ts-var-checkbox-border-color': resolveVar('--app-border-strong'),
//   '--ts-var-checkbox-hover-border': resolveVar('--app-dd-primary'),
//   '--ts-var-checkbox-active-color': resolveVar('--app-dd-primary'),
//   '--ts-var-checkbox-checked-color': resolveVar('--app-dd-primary'),
//   '--ts-var-checkbox-checked-disabled': resolveVar('--app-muted-fg'),
//   '--ts-var-checkbox-error-border': resolveVar('--app-error'),
//   '--ts-var-checkbox-background-color': 'transparent',
//
//   // ── Chart axes ──────────────────────────────────────────────────────────
//   '--ts-var-axis-title-color': resolveVar('--app-muted-fg'),
//   '--ts-var-axis-data-label-color': resolveVar('--app-muted-fg'),
//
//   // ── Chart legends ───────────────────────────────────────────────────────
//   '--ts-var-chart-heatmap-legend-title-color': resolveVar('--app-fg'),
//   '--ts-var-chart-heatmap-legend-label-color': resolveVar('--app-muted-fg'),
//   '--ts-var-chart-treemap-legend-title-color': resolveVar('--app-fg'),
//   '--ts-var-chart-treemap-legend-label-color': resolveVar('--app-muted-fg'),
//
//   // ── KPI widgets ─────────────────────────────────────────────────────────
//   '--ts-var-kpi-hero-color': resolveVar('--app-fg'),
//   '--ts-var-kpi-comparison-color': resolveVar('--app-muted-fg'),
//   '--ts-var-kpi-analyze-text-color': resolveVar('--app-dd-primary'),
//   '--ts-var-kpi-positive-change-color': resolveVar('--app-success'),
//   '--ts-var-kpi-negative-change-color': resolveVar('--app-error'),
//
//   // ── SpotIQ & Change Analysis cards ──────────────────────────────────────
//   '--ts-var-change-analysis-insights-background': resolveVar('--app-card'),
//   '--ts-var-spotiq-analyze-forecasting-card-background': resolveVar('--app-card'),
//   '--ts-var-spotiq-analyze-outlier-card-background': resolveVar('--app-card'),
//   '--ts-var-spotiq-analyze-trend-card-background': resolveVar('--app-card'),
//   '--ts-var-spotiq-analyze-crosscorrelation-card-background': resolveVar('--app-card'),
//   '--ts-var-cca-modal-summary-header-background': resolveVar('--app-bg-secondary'),
// })
//
// ── Commented-out CSS overrides for color theming ──────────────────────────
// These were in resolveThoughtSpotCssOverrides. To re-enable, add them back
// into the return object of that function and uncomment resolveVar above.
//
// ':root': { 'color-scheme': isDark ? 'dark' : 'light' },
//
// '[class*="selectedNavItem"]': {
//   color: `${resolveVar('--app-dd-primary')} !important`,
// },
// '[class*="navItem"]:hover': {
//   color: `${resolveVar('--app-fg')} !important`,
// },
//
// '.ag-root-wrapper': { 'background-color': card, color: fg },
// '.ag-header': { 'background-color': secondary, color: fg, 'border-bottom-color': border },
// '.ag-header-cell': { color: fg },
// '.ag-row': { 'background-color': card, color: fg, 'border-bottom-color': border },
// '.ag-row-odd': { 'background-color': bg },
// '.ag-row-hover': { 'background-color': `${secondary} !important` },
// '.ag-pinned-left-cols-container': { 'background-color': card },
// '.ag-pinned-right-cols-container': { 'background-color': card },
// '.ag-cell-first-right-pinned': { 'border-left-color': border },
// '.ag-cell-last-left-pinned': { 'border-right-color': border },
