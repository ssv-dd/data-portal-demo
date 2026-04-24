import styled from 'styled-components'

export const LegendContainer = styled.ul<{ readonly $position: 'top' | 'bottom' | 'left' | 'right' }>`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  list-style: none;
  margin: 0;
  padding: 4px 0;
  justify-content: center;

  ${({ $position }) =>
    ($position === 'left' || $position === 'right') &&
    `
    flex-direction: column;
    justify-content: flex-start;
  `}
`

export const LegendItem = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--app-fg);
  line-height: 1.4;
  cursor: default;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const LegendDot = styled.span<{ readonly $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`
