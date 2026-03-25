---
name: card-styling
description: Defines visual styling conventions for card-like components. Use when creating new cards, panels, containers, modals, or any elevated surface component. Ensures consistent rounded corners and visual language.
---

# Card & Surface Styling Conventions

## Rounded Corners

All card-like components must use generous rounded corners following the Tailwind CSS `rounded-2xl` equivalent (`border-radius: 1rem / 16px`).

### Standard radii

| Surface type | Radius | CSS value |
|---|---|---|
| Cards, panels, containers | `rounded-2xl` | `border-radius: 1rem` |
| Modals, dialogs, sheets | `rounded-2xl` | `border-radius: 1rem` |
| Inputs, buttons, badges | `rounded-xl` | `border-radius: 0.75rem` |
| Small chips, tags | `rounded-lg` | `border-radius: 0.5rem` |
| Pills, toggles | `rounded-full` | `border-radius: 9999px` |

### In styled-components

Use the `radius` tokens from `@/styles/theme`:

```tsx
import styled from 'styled-components';
import { radius } from '@/styles/theme';

const MyCard = styled.div`
  border-radius: ${radius['2xl']};  /* 1rem — default for cards */
  /* OR for the theme-aware approach: */
  border-radius: 1rem;
`;
```

### Visual treatment for elevated surfaces

Cards and panels should include:

```tsx
const Card = styled.div`
  border-radius: 1rem;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03);
`;
```

### Glass panel variant (for overlays, sidebars, floating panels)

```tsx
const GlassPanel = styled.div`
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
`;
```

## Do NOT

- Use sharp corners (`border-radius: 0`) for any card or panel
- Use `rounded-sm` / `rounded-md` for cards (too subtle)
- Mix different corner radii on the same surface type within a page
