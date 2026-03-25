import { ColorMode, type ThemingOverridesType } from '@doordash/prism-react'

/**
 * Prism light: stock InternalTools tokens (no overrides).
 * Prism dark: merge these partials on top of InternalTools dark, with values
 * coming from `--app-*` in `global-styles.ts` so palette stays in one place.
 *
 * Copy this file + the `--app-*` blocks when lifting to ops-tools data-portal.
 */
export const dataPortalPrismThemingOverrides: ThemingOverridesType = (
  _tokens,
  colorMode,
) => {
  if (colorMode !== ColorMode.dark) {
    return {}
  }

  const app = {
    bg: 'var(--app-bg)',
    bgSecondary: 'var(--app-bg-secondary)',
    card: 'var(--app-card)',
    fg: 'var(--app-fg)',
    muted: 'var(--app-muted)',
    mutedFg: 'var(--app-muted-fg)',
    accent: 'var(--app-accent)',
    primary: 'var(--app-primary)',
    primaryFg: 'var(--app-primary-fg)',
    secondary: 'var(--app-secondary)',
    secondaryFg: 'var(--app-secondary-fg)',
    border: 'var(--app-border)',
    borderStrong: 'var(--app-border-strong)',
    ddPrimary: 'var(--app-dd-primary)',
    error: 'var(--app-error)',
    success: 'var(--app-success)',
    warning: 'var(--app-warning)',
    info: 'var(--app-info)',
    overlay: 'rgba(var(--app-overlay-rgb) / 0.48)',
  } as const

  return {
    usage: {
      color: {
        overlay: app.overlay,
        background: {
          default: app.bg,
          hovered: app.bg,
          pressed: app.bg,
          disabled: app.muted,
          selected: app.accent,
          selectedHovered: app.accent,
          selectedPressed: app.accent,
          selectedDisabled: app.muted,
          strong: {
            default: app.card,
            hovered: app.card,
            pressed: app.card,
          },
          elevated: {
            default: app.card,
            hovered: app.card,
            pressed: app.card,
          },
          subdued: {
            default: app.bgSecondary,
            hovered: app.muted,
            pressed: app.accent,
          },
          inverse: {
            default: app.primary,
            hovered: app.primary,
            pressed: app.primary,
            subdued: {
              default: app.secondary,
              hovered: app.secondary,
              pressed: app.secondary,
            },
          },
          transparent: {
            default: 'transparent',
            hovered: app.accent,
            pressed: app.accent,
          },
        },
        text: {
          default: app.fg,
          hovered: app.fg,
          pressed: app.fg,
          disabled: app.mutedFg,
          selected: app.fg,
          selectedHovered: app.fg,
          selectedPressed: app.fg,
          selectedDisabled: app.mutedFg,
          subdued: {
            default: app.mutedFg,
            hovered: app.mutedFg,
            pressed: app.mutedFg,
          },
          inverse: {
            default: app.primaryFg,
            hovered: app.primaryFg,
            pressed: app.primaryFg,
            subdued: {
              default: app.secondaryFg,
              hovered: app.secondaryFg,
              pressed: app.secondaryFg,
            },
          },
          link: {
            default: app.info,
            hovered: app.info,
            pressed: app.info,
          },
          overlay: {
            default: app.fg,
            hovered: app.fg,
            pressed: app.fg,
          },
        },
        border: {
          default: app.border,
          focused: app.ddPrimary,
          hovered: app.borderStrong,
          pressed: app.borderStrong,
          disabled: app.border,
          inverse: { focused: app.border },
          selected: app.ddPrimary,
          selectedHovered: app.ddPrimary,
          selectedPressed: app.ddPrimary,
          selectedDisabled: app.border,
          strong: {
            default: app.borderStrong,
            hovered: app.borderStrong,
            pressed: app.borderStrong,
          },
        },
        icon: {
          default: app.fg,
          hovered: app.fg,
          pressed: app.fg,
          disabled: app.mutedFg,
          selected: app.fg,
          selectedHovered: app.fg,
          selectedPressed: app.fg,
          selectedDisabled: app.mutedFg,
          subdued: {
            default: app.mutedFg,
            hovered: app.mutedFg,
            pressed: app.mutedFg,
          },
          inverse: {
            default: app.primaryFg,
            hovered: app.primaryFg,
            pressed: app.primaryFg,
            subdued: {
              default: app.secondaryFg,
              hovered: app.secondaryFg,
              pressed: app.secondaryFg,
            },
          },
          overlay: {
            default: app.fg,
            hovered: app.fg,
            pressed: app.fg,
          },
        },
        action: {
          primary: {
            default: app.ddPrimary,
            hovered: app.ddPrimary,
            pressed: app.ddPrimary,
            subdued: {
              default: app.muted,
              hovered: app.accent,
              pressed: app.accent,
            },
            strong: {
              default: app.ddPrimary,
              hovered: app.ddPrimary,
              pressed: app.ddPrimary,
            },
          },
          secondary: {
            default: app.secondary,
            hovered: app.secondary,
            pressed: app.secondary,
            subdued: {
              default: app.muted,
              hovered: app.accent,
              pressed: app.accent,
            },
          },
          transparent: {
            default: 'transparent',
            hovered: app.accent,
            pressed: app.accent,
          },
        },
        negative: {
          default: app.error,
          hovered: app.error,
          pressed: app.error,
          strong: {
            default: app.error,
            hovered: app.error,
            pressed: app.error,
          },
          subdued: {
            default: app.muted,
            hovered: app.accent,
            pressed: app.accent,
          },
        },
        positive: {
          default: app.success,
          hovered: app.success,
          pressed: app.success,
          strong: {
            default: app.success,
            hovered: app.success,
            pressed: app.success,
          },
          subdued: {
            default: app.muted,
            hovered: app.accent,
            pressed: app.accent,
          },
        },
        warning: {
          default: app.warning,
          hovered: app.warning,
          pressed: app.warning,
          strong: {
            default: app.warning,
            hovered: app.warning,
            pressed: app.warning,
          },
          subdued: {
            default: app.muted,
            hovered: app.accent,
            pressed: app.accent,
          },
        },
        highlight: {
          default: app.info,
          hovered: app.info,
          pressed: app.info,
          strong: {
            default: app.info,
            hovered: app.info,
            pressed: app.info,
          },
          subdued: {
            default: app.muted,
            hovered: app.accent,
            pressed: app.accent,
          },
        },
        brand: {
          primary: app.ddPrimary,
          secondary: app.secondary,
          dashpass: app.ddPrimary,
        },
      },
    },
  }
}
