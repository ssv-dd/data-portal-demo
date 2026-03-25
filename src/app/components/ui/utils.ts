import { css } from 'styled-components';

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const truncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const lineClamp = (lines: number) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const focusRing = css`
  &:focus-visible {
    outline: 2px solid rgb(var(--app-violet-deep-rgb) / 0.5);
    outline-offset: 2px;
  }
`;
