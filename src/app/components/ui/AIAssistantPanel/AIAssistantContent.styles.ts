import { TextStyle, Theme } from '@doordash/prism-react'
import { motion } from 'framer-motion'
import styled from 'styled-components'

/** Fills the panel body: scrollable welcome + recommendations, chat input pinned to bottom. */
export const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  align-self: stretch;
`

export const WelcomeWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.xSmall};
  min-height: 0;
  width: 100%;
  padding: ${Theme.usage.space.small};
  text-align: center;
  overflow: auto;
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

export const WelcomeIconWrap = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${Theme.usage.borderRadius.large};
  background: linear-gradient(
    to bottom right,
    rgb(var(--app-violet-deep-rgb) / 0.15),
    rgb(var(--app-violet-deep-rgb) / 0.08)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${Theme.usage.space.medium};
`

export const WelcomeLine = styled.p<{ $textColor: string }>`
  margin: 0;
  max-width: 100%;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ $textColor }) => $textColor};
`

/** Vertical stack of full-width suggestion chips (SQL Assistant welcome). */
export const RecommendationsStack = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
  width: 100%;
  max-width: 420px;
  margin-top: ${Theme.usage.space.large};
  align-self: stretch;
`

export const RecommendationPill = styled(motion.button)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${Theme.usage.space.small};
  width: 100%;
  min-height: 44px;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-radius: ${Theme.usage.borderRadius.large};
  border: 1px solid rgb(var(--app-violet-deep-rgb) / 0.06);
  background: rgb(var(--app-surface-rgb) / 0.5);
  color: ${Theme.usage.color.text.default};
  font-size: ${TextStyle.label.xSmall.default.size};
  line-height: 1.35;
  text-align: left;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: rgb(var(--app-surface-rgb) / 0.8);
    border-color: rgb(var(--app-violet-deep-rgb) / 0.12);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`

export const PillIconWrap = styled.span<{ $iconColor: string }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: ${({ $iconColor }) => $iconColor};
`

export const PillLabel = styled.span`
  flex: 1;
  min-width: 0;
`

export const WelcomeAssistantName = styled.h2`
  margin: 0;
  font-size: ${TextStyle.body.medium.strong.size};
`

export const WelcomeAssistantDescription = styled.p`
  margin: 0;
  max-width: 400px;
  font-size: ${TextStyle.body.medium.default.size};
  opacity: 0.3;
`
