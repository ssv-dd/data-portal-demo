import { Theme } from '@doordash/prism-react'
import styled from 'styled-components'

const fontSize = '13px'

export const ThreadRoot = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
`

export const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  scroll-behavior: smooth;

  /* Hide scrollbar for Chrome, Safari, and Edge */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;

  /* Hide scrollbar for IE 10+ */
  -ms-overflow-style: none;
`

export const ThreadList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
  margin: 0;
  padding: 0 ${Theme.usage.space.small};
  min-width: 0;
`

export const MessageBlock = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isUser }) => ($isUser ? 'flex-end' : 'stretch')};
  width: 100%;
  max-width: 100%;
  min-width: 0;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.medium};
  font-size: ${fontSize};
`

/** Full-width assistant text + markdown */
export const AssistantBubble = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-radius: ${Theme.usage.borderRadius.medium};
  color: ${Theme.usage.color.text.default};
  font-size: ${fontSize};
`

/** User bubble — not full width */
export const UserBubble = styled.div`
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${Theme.usage.color.highlight.strong.default};
  color: ${Theme.usage.color.text.inverse.default};
  text-align: left;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
`

export const MarkdownBody = styled.div`
  font-size: ${fontSize};
  line-height: 1.55;
  min-width: 0;
  word-wrap: break-word;
  overflow-wrap: anywhere;
  word-break: break-word;

  & > div {
    font-size: ${fontSize};
    line-height: 1.55;
  }

  p {
    margin: 0 0 ${Theme.usage.space.small} 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  h1,
  h2,
  h3 {
    margin: ${Theme.usage.space.medium} 0 ${Theme.usage.space.small} 0;
    font-weight: 600;
    line-height: 1.3;

    &:first-child {
      margin-top: 0;
    }
  }

  ul,
  ol {
    margin: 0 0 ${Theme.usage.space.small} 0;
    padding-left: ${Theme.usage.space.large};
  }

  li {
    margin-bottom: ${Theme.usage.space.xxSmall};
  }

  blockquote {
    margin: ${Theme.usage.space.small} 0;
    padding-left: ${Theme.usage.space.medium};
    border-left: 3px solid ${Theme.usage.color.border.default};
    color: ${Theme.usage.color.text.subdued.default};
  }

  code {
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    font-size: ${fontSize};
    padding: 2px 6px;
    background: ${Theme.usage.color.background.strong.default};
    border-radius: 4px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  pre {
    margin: ${Theme.usage.space.small} 0;
    padding: ${Theme.usage.space.small};
    max-width: 100%;
    overflow-x: hidden;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;
    background: ${Theme.usage.color.background.strong.default};
    border-radius: ${Theme.usage.borderRadius.small};
    font-size: ${fontSize};
  }

  pre code {
    padding: 0;
    background: none;
  }

  a {
    color: ${Theme.usage.color.highlight.strong.default};
  }
`

/** Plain list for intermediate steps — no card wrapper */
export const ToolStepsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
`

export const AssistantActions = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  max-width: 100%;
`

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: ${Theme.usage.borderRadius.small};
  background: transparent;
  color: ${Theme.usage.color.text.subdued.default};
  cursor: pointer;

  &:hover {
    background: ${Theme.usage.color.background.hovered};
    color: ${Theme.usage.color.text.default};
  }
`

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${Theme.usage.space.small};
  margin: ${Theme.usage.space.small} 0 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
`

export const MetricCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.small};
  background: ${Theme.usage.color.background.default};
  border: 1px solid ${Theme.usage.color.border.default};
  border-radius: ${Theme.usage.borderRadius.medium};
`

export const MetricLabel = styled.span`
  font-size: ${fontSize};
  color: ${Theme.usage.color.text.subdued.default};
`

export const MetricValue = styled.span`
  font-size: ${fontSize};
  font-weight: 600;
  color: ${Theme.usage.color.text.default};
`

export const ChartsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
  margin: ${Theme.usage.space.small} 0 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
`

export const ChartBlockTitle = styled.div`
  margin-bottom: ${Theme.usage.space.xxSmall};
  font-size: ${fontSize};
  font-weight: 600;
  color: ${Theme.usage.color.text.subdued.default};
`

export const ChartPlaceholder = styled.div`
  padding: ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.medium};
  border: 1px dashed ${Theme.usage.color.border.default};
  font-size: ${fontSize};
  color: ${Theme.usage.color.text.subdued.default};
`

export const DataTable = styled.table`
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  font-size: ${fontSize};

  th,
  td {
    padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
    border: 1px solid ${Theme.usage.color.border.default};
    text-align: left;
  }

  th {
    background: ${Theme.usage.color.background.subdued.default};
    font-weight: 600;
  }
`

export const ChartWithActions = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 90%;

  /* Remove bottom radius + border from chart card; footer provides them */
  & > *:first-child {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
    max-width: 100%;
  }
`

export const ChartActionFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  background: ${Theme.usage.color.background.default};
  border: 1px solid ${Theme.usage.color.border.default};
  border-radius: 0 0 ${Theme.usage.borderRadius.large} ${Theme.usage.borderRadius.large};
`

export const ChartActionPrimary = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: none;
  border-radius: ${Theme.usage.borderRadius.full};
  background: ${Theme.usage.color.action.primary.default};
  color: ${Theme.usage.color.text.inverse.default};
  font-size: ${fontSize};
  font-weight: 600;
  cursor: pointer;
  transition: all 120ms ease;

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

export const ChartActionSecondary = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid ${Theme.usage.color.border.default};
  border-radius: ${Theme.usage.borderRadius.full};
  background: transparent;
  color: ${Theme.usage.color.text.subdued.default};
  font-size: ${fontSize};
  font-weight: 500;
  cursor: pointer;
  transition: all 120ms ease;

  &:hover {
    border-color: ${Theme.usage.color.border.strong.default};
    color: ${Theme.usage.color.text.default};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    flex-shrink: 0;
  }
`

export const RecommendationsCard = styled.div`
  margin: ${Theme.usage.space.small} 0 0;
  padding: ${Theme.usage.space.small};
  background: color-mix(in srgb, ${Theme.usage.color.warning.default} 10%, transparent);
  border: 1px solid color-mix(in srgb, ${Theme.usage.color.warning.default} 30%, transparent);
  border-radius: ${Theme.usage.borderRadius.medium};
  width: 100%;
  max-width: 100%;
`

export const RecommendationsTitle = styled.h4`
  margin: 0 0 ${Theme.usage.space.small} 0;
  font-size: ${fontSize};
  font-weight: 600;
  color: ${Theme.usage.color.text.default};
`

export const RecommendationsList = styled.ul`
  margin: 0;
  padding-left: ${Theme.usage.space.large};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`

export const RecommendationItem = styled.li`
  color: ${Theme.usage.color.text.default};
  font-size: ${fontSize};
  line-height: 1.5;

  p {
    display: inline;
    margin: 0;
  }
`
