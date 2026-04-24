import { Theme } from '@doordash/prism-react'
import styled, { css } from 'styled-components'

/**
 * Matches `FormikMonacoField` / Prism `TextField` outline: default border, focus ring on `focus-within`,
 * error border when invalid.
 */
export const SqlEditorInputShell = styled.div<{ $hasError: boolean }>`
  border-radius: ${Theme.usage.borderRadius.medium};
  overflow: hidden;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  ${({ $hasError }) =>
    $hasError
      ? css`
          border: 1px solid ${Theme.usage.color.negative.default};
          &:focus-within {
            border-color: ${Theme.usage.color.negative.default};
            box-shadow: 0 0 0 2px ${Theme.usage.color.negative.subdued.default};
          }
        `
      : css`
          border: 1px solid ${Theme.usage.color.border.default};
          &:focus-within {
            border-color: ${Theme.usage.color.border.focused};
            box-shadow: 0 0 0 2px ${Theme.usage.color.border.focused};
          }
        `}
`

/** Toolbar + Monaco stack (fills the bordered shell). */
export const EditorChrome = styled.div<{ $minHeight: string }>`
  display: flex;
  flex-direction: column;
  min-height: ${({ $minHeight }) => $minHeight};
  height: ${({ $minHeight }) => $minHeight};
  overflow: hidden;
`

export const MonacoArea = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`
