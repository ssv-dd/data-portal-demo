import { TextStyle, Theme } from '@doordash/prism-react'
import styled from 'styled-components'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  width: 100%;
`

export const Heading = styled.h2`
  margin: 0 0 ${Theme.usage.space.medium};
  padding: 0;
  font-size: ${TextStyle.body.medium.strong.size};
  font-weight: 600;
  line-height: 1.3;
  color: ${Theme.usage.color.text.default};
`

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  min-height: 0;
  flex: 1;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const Item = styled.li`
  border-bottom: 1px solid ${Theme.usage.color.border.default};

  &:last-child {
    border-bottom: none;
  }
`

export const ItemButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${Theme.usage.space.xxSmall};
  width: 100%;
  padding: ${Theme.usage.space.small};
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: inherit;
  font: inherit;
  transition: background-color 120ms ease;

  &:hover {
    background: rgb(var(--app-violet-deep-rgb) / 0.06);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const ItemTitle = styled.span`
  font-size: ${TextStyle.body.small.default.size};
  font-weight: 500;
  line-height: 1.35;
  color: ${Theme.usage.color.text.default};
`

export const ItemMeta = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  line-height: 1.35;
  color: ${Theme.usage.color.text.subdued.default};
`

export const EmptyState = styled.p`
  margin: ${Theme.usage.space.medium} 0 0;
  font-size: ${TextStyle.body.small.default.size};
  color: ${Theme.usage.color.text.subdued.default};
`

export const ErrorState = styled.p`
  margin: ${Theme.usage.space.medium} 0 0;
  font-size: ${TextStyle.body.small.default.size};
  color: ${Theme.usage.color.text.subdued.default};
`
