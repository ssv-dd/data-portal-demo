import { useState, useRef, useEffect, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ChevronRight, ChevronDown, Database, Table, Search, Clock, Users, Plus, Play, Square, Share2, BookmarkPlus, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Sparkles, MessageSquare, X, BookOpen, ArrowUp, Folder, FolderOpen, BarChart3, Maximize2, Minimize2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { mockSavedQueries, sampleResults, DEFAULT_SQL } from '../data/mock/sql-studio-data';
import { GradientOrb } from '../components/hero/gradient-orb';
import { Theme } from '@doordash/prism-react';
import { colors, fonts, shadows, glassPanel, glassPanelSubtle, glassPanelChat } from '@/styles/theme';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

/* ─── Shared page-level containers ──────────────────────────────────── */

const PageContainer = styled.div`
  height: 100%;
  background-color: ${colors.background};
  overflow: hidden;
  position: relative;
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgb(var(--app-fuchsia-rgb) / 0.08), transparent 35%),
              radial-gradient(circle at bottom right, rgb(var(--app-blue-rgb) / 0.08), transparent 35%);
`;

/* ─── Landing page ──────────────────────────────────────────────────── */

const LandingLayout = styled.div`
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  overflow: hidden;
`;

const LandingMain = styled.div`
  flex: 1;
  padding: ${Theme.usage.space.xLarge};
  overflow: auto;
`;

const LandingInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const LandingHeader = styled.div`
  margin-bottom: ${Theme.usage.space.xLarge};
`;

const LandingTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.small};
`;

const LandingTitle = styled.h1`
  font-size: ${Theme.usage.fontSize.xxLarge};
  color: ${colors.ddPrimary};
`;

const LandingSubtitle = styled.p`
  color: ${colors.mutedForeground};
`;

const LandingSearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.medium};
  margin-bottom: ${Theme.usage.space.large};
`;

const LandingSearchWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const LandingFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.large};
`;

const LandingGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${Theme.usage.space.large};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const QueryCard = styled.div`
  background-color: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  padding: 20px;
  cursor: pointer;
  transition: box-shadow 200ms;

  &:hover {
    box-shadow: ${shadows.cardHover};
  }
`;


const QueryCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.small};
`;

const QueryCardTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const QueryCardTitle = styled.h3`
  font-weight: 500;
  color: ${colors.slate900};
`;

const QueryCardDesc = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.slate600};
  margin-bottom: ${Theme.usage.space.medium};
`;

const QueryCardMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.slate600};
  gap: ${Theme.usage.space.xxSmall};
`;

const LandingEmptyState = styled.div`
  text-align: center;
  padding: 64px 0;
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
`;

const LandingEmptyIcon = styled(Database)`
  width: 48px;
  height: 48px;
  margin: 0 auto ${Theme.usage.space.medium};
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
`;

const LandingEmptyText = styled.p`
  color: ${colors.slate600};
  margin-bottom: ${Theme.usage.space.medium};
`;

/* ─── Landing Right Panel ───────────────────────────────────────────── */

const LandingRightPanel = styled.div`
  width: 440px;
  border-left: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: rgb(var(--app-surface-rgb) / 0.9);
  backdrop-filter: blur(24px);
`;

const LandingRightHeader = styled.div`
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-bottom: 1px solid ${colors.border};
`;

const LandingRightTitle = styled.h3`
  font-weight: 600;
  color: ${colors.slate900};
`;

const LandingRightBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const LandingRightContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: ${Theme.usage.space.large} ${Theme.usage.space.medium};
  display: flex;
  flex-direction: column;
`;

const LandingRightCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AssistantIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${Theme.usage.borderRadius.xLarge};
  background: linear-gradient(to bottom right, rgb(var(--app-violet-rgb) / 0.15), rgb(var(--app-violet-rgb) / 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${Theme.usage.space.medium};
`;

const AssistantTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.slate900};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const AssistantDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.slate600};
  text-align: center;
  max-width: 240px;
  line-height: 1.625;
  margin-bottom: ${Theme.usage.space.large};
`;

const SuggestionList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const SuggestionButton = styled.button`
  width: 100%;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-radius: ${Theme.usage.borderRadius.large};
  border: 1px solid ${colors.slate200};
  background-color: ${colors.white};
  color: ${colors.slate900};
  font-size: ${Theme.usage.fontSize.xxSmall};
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: ${colors.slate50};
  }
`;

const LandingInputArea = styled.div`
  padding: ${Theme.usage.space.small};
`;

const LandingInputBox = styled.div`
  border: 1px solid ${colors.slate200};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  background-color: ${colors.white};
  overflow: hidden;
`;

const LandingKbRow = styled.div`
  padding: ${Theme.usage.space.small} ${Theme.usage.space.small} 0;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const KbBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.full};
  background-color: ${colors.slate100};
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.slate700};
`;

const LandingTextarea = styled.textarea`
  width: 100%;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.slate900};
  background: transparent;
  border: none;
  outline: none;
  resize: none;

  &::placeholder {
    color: ${colors.slate400};
  }
`;

const LandingInputFooter = styled.div`
  padding: 0 ${Theme.usage.space.small} ${Theme.usage.space.small};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SmallIconButton = styled.button`
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.small};
  border: none;
  background: none;
  cursor: pointer;
  color: ${colors.slate500};
  transition: background-color 150ms, color 150ms;

  &:hover {
    background-color: ${colors.slate100};
    color: ${colors.slate900};
  }
`;

const SendButton = styled.button`
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  border: none;
  background-color: ${colors.slate100};
  color: ${colors.slate400};
  cursor: default;
`;

/* ─── Editor View ───────────────────────────────────────────────────── */

const EditorLayout = styled.div`
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  overflow: hidden;
  padding: ${Theme.usage.space.xSmall};
  gap: ${Theme.usage.space.xSmall};
`;

/* ── Left Panel ── */

const LeftPanelContainer = styled.div`
  width: 288px;
  border-radius: ${Theme.usage.borderRadius.xLarge};
  border: 1px solid ${colors.border};
  background-color: rgb(var(--app-surface-rgb) / 0.9);
  backdrop-filter: blur(24px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 200ms;
`;

const LeftPanelCollapsed = styled.div`
  width: 44px;
  border-radius: ${Theme.usage.borderRadius.xLarge};
  border: 1px solid ${colors.border};
  background-color: rgb(var(--app-surface-rgb) / 0.6);
  backdrop-filter: blur(24px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${Theme.usage.space.small};
  transition: all 200ms;
`;

const PanelHeader = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${Theme.usage.space.small};
  flex-shrink: 0;
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
`;

const PanelTabGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  background-color: ${colors.slate100};
  border: 1px solid rgb(var(--app-accent-rgb) / 0.5);
`;

const PanelTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  border-radius: ${Theme.usage.borderRadius.large};
  text-transform: capitalize;
  border: none;
  cursor: pointer;
  transition: all 200ms;

  ${({ $active }) => $active ? css`
    background-color: ${colors.white};
    color: ${colors.slate900};
    box-shadow: ${shadows.sm};
    border: 1px solid rgb(var(--app-accent-rgb) / 0.5);
  ` : css`
    background: none;
    color: ${colors.slate600};
    border: 1px solid transparent;
    &:hover { color: ${colors.slate900}; }
  `}
`;

const PanelToggleButton = styled.button`
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  border: none;
  background: none;
  color: ${colors.slate600};
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background-color: ${colors.slate100};
    color: ${colors.slate900};
  }
`;

const PanelBody = styled.div`
  flex: 1;
  overflow: auto;
`;

const PanelSection = styled.div`
  padding: ${Theme.usage.space.xSmall};
`;

const PanelSearchInput = styled.input`
  font-size: ${Theme.usage.fontSize.xxSmall};
  width: 100%;
  border-radius: ${Theme.usage.borderRadius.large};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  background-color: ${colors.slate50};
  color: ${colors.slate900};
  border: 1px solid ${colors.slate200};
  outline: none;
  transition: background-color 200ms;

  &::placeholder { color: ${colors.slate400}; }
  &:focus { background-color: ${colors.slate100}; }
`;

const CatalogSearchWrapper = styled.div`
  position: relative;
  padding: ${Theme.usage.space.small};
`;

const CatalogSearchIcon = styled(Search)`
  position: absolute;
  left: ${Theme.usage.space.large};
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: ${colors.slate400};
`;

const CatalogSearchInput = styled.input`
  font-size: ${Theme.usage.fontSize.xxSmall};
  width: 100%;
  border-radius: ${Theme.usage.borderRadius.large};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small} ${Theme.usage.space.xSmall} ${Theme.usage.space.xLarge};
  background-color: ${colors.slate50};
  color: ${colors.slate900};
  border: 1px solid ${colors.slate200};
  outline: none;
  transition: background-color 200ms;

  &::placeholder { color: ${colors.slate400}; }
  &:focus { background-color: ${colors.slate100}; }
`;

const SectionLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: ${colors.slate500};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SectionHeader = styled.div`
  padding: ${Theme.usage.space.xSmall};
  padding-top: ${Theme.usage.space.small};
  padding-bottom: ${Theme.usage.space.xxSmall};
`;

const SectionHeaderWithAction = styled.div`
  padding: ${Theme.usage.space.xSmall};
  padding-top: 20px;
  padding-bottom: ${Theme.usage.space.xxSmall};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TreeItem = styled.div`
  padding: ${Theme.usage.space.small} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.large};
  cursor: pointer;
  margin-bottom: ${Theme.usage.space.xxxSmall};
  transition: all 150ms;

  &:hover {
    background-color: ${colors.slate100};
  }
`;

const TreeItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xSmall};
`;

const TreeItemTitle = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.slate900};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TreeItemTimestamp = styled.div`
  font-size: 10px;
  color: ${colors.slate500};
  margin-top: ${Theme.usage.space.xxxSmall};
`;

const FolderButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.small} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.large};
  cursor: pointer;
  border: none;
  background: none;
  text-align: left;
  transition: all 150ms;

  &:hover {
    background-color: ${colors.slate100};
  }
`;

const FolderName = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.slate900};
`;

const FolderCount = styled.span`
  font-size: 10px;
  color: ${colors.slate400};
  margin-left: auto;
`;

const FolderChildren = styled.div`
  margin-left: 20px;
  padding-left: ${Theme.usage.space.small};
  border-left: 1px solid ${colors.slate200};
`;

const FolderChild = styled.div`
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  cursor: pointer;
  margin-bottom: ${Theme.usage.space.xxxSmall};
  transition: all 150ms;

  &:hover {
    background-color: ${colors.slate100};
  }
`;

const CatalogItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  cursor: pointer;
  margin-bottom: ${Theme.usage.space.xxxSmall};
  transition: all 150ms;

  &:hover {
    background-color: ${colors.slate100};
  }
`;

const CatalogItemName = styled.span<{ $mono?: boolean }>`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.slate900};
  ${({ $mono }) => $mono && css`font-family: ${fonts.mono};`}
`;

const NewFolderButton = styled.button`
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  border: none;
  background: none;
  color: ${colors.slate400};
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background-color: ${colors.slate100};
    color: ${colors.slate900};
  }
`;

/* ── Center Panel ── */

const CenterContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
  min-width: 0;
  overflow: hidden;
`;

const EditorCard = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-radius: ${Theme.usage.borderRadius.xLarge};
  ${glassPanel}
  overflow: hidden;
`;

const TabBar = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${Theme.usage.space.medium};
  flex-shrink: 0;
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  background-color: rgb(var(--app-slate50-rgb) / 0.5);
`;

const TabList = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  min-width: 0;
  overflow-x: auto;
`;

const FileTab = styled.div<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border-top-left-radius: ${Theme.usage.borderRadius.large};
  border-top-right-radius: ${Theme.usage.borderRadius.large};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-family: ${fonts.mono};
  cursor: pointer;
  flex-shrink: 0;
  border: 1px solid transparent;
  border-bottom: none;
  transition: all 200ms;

  ${({ $active }) => $active ? css`
    background-color: ${colors.white};
    color: ${colors.slate900};
    border-color: ${colors.slate200};
  ` : css`
    background: transparent;
    color: ${colors.slate500};
    &:hover { background-color: rgb(var(--app-slate100-rgb) / 0.5); }
  `}
`;

const TabCloseButton = styled.button`
  opacity: 0;
  padding: ${Theme.usage.space.xxxSmall};
  border-radius: ${Theme.usage.borderRadius.small};
  border: none;
  background: none;
  color: ${colors.slate400};
  cursor: pointer;
  transition: all 150ms;
  margin-right: -4px;

  ${FileTab}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: ${colors.slate100};
    color: ${colors.slate700};
  }
`;

const TabName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
`;

const TabRenameInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-family: ${fonts.mono};
  width: 120px;
  padding: 0;
`;

const NewTabButton = styled.button`
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  border: none;
  background: none;
  color: ${colors.slate400};
  cursor: pointer;
  margin-left: ${Theme.usage.space.xxSmall};
  flex-shrink: 0;
  transition: all 200ms;

  &:hover {
    background-color: ${colors.slate100};
    color: ${colors.slate700};
  }
`;

const TabBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const EngineSelect = styled.select`
  font-size: ${Theme.usage.fontSize.xxSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  background-color: ${colors.white};
  color: ${colors.slate900};
  border: 1px solid ${colors.slate200};
  outline: none;
  transition: all 200ms;

  &:focus {
    box-shadow: 0 0 0 2px rgb(var(--app-violet-rgb) / 0.2);
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  font-size: ${Theme.usage.fontSize.xxSmall};
  height: 32px;
  padding: 0 ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.large};
  border: 1px solid ${colors.slate200};
  background-color: ${colors.white};
  color: ${colors.slate700};
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background-color: ${colors.slate50};
  }
`;

const ExpandButton = styled.button`
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  border: none;
  background: none;
  color: ${colors.slate600};
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background-color: ${colors.slate100};
    color: ${colors.slate900};
  }
`;

const MonacoWrapper = styled.div<{ $dark?: boolean }>`
  flex: 1;
  min-height: 0;
  background-color: ${({ $dark }) => $dark ? '#0b1220' : colors.white};
`;

/* ── Results Card ── */

const ResultsCard = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-radius: ${Theme.usage.borderRadius.xLarge};
  ${glassPanel}
  overflow: hidden;
`;

const RecommendationBanner = styled.div`
  margin: ${Theme.usage.space.small} ${Theme.usage.space.small} 0;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  background-color: ${colors.rose50};
  border: 1px solid ${colors.rose200};
`;

const BannerRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const BannerItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const PulseDot = styled.span<{ $animate?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: ${Theme.usage.borderRadius.full};
  background-color: ${colors.rose500};
  ${({ $animate }) => $animate && css`animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;`}
`;

const BannerLabel = styled.span`
  color: #881337;
  font-weight: 600;
`;

const BannerDetail = styled.span`
  color: #9f1239;
`;

const BannerCode = styled.code`
  font-family: ${fonts.mono};
  background-color: ${colors.rose50};
  padding: ${Theme.usage.space.xxxSmall} ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.small};
  color: #881337;
`;

const BannerAction = styled.button`
  margin-left: auto;
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.violet600};
  background: none;
  border: none;
  cursor: pointer;
  transition: color 200ms;

  &:hover { color: ${colors.violet700 ?? '#6d28d9'}; }
`;

const ResultsTabBar = styled.div`
  display: flex;
  align-items: center;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  flex-shrink: 0;
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
`;

const ResultsTabGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  background-color: ${colors.slate100};
  border: 1px solid rgb(var(--app-accent-rgb) / 0.5);
`;

const ResultsTab = styled.button<{ $active: boolean }>`
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.medium};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 600;
  border-radius: ${Theme.usage.borderRadius.large};
  text-transform: capitalize;
  border: none;
  cursor: pointer;
  transition: all 200ms;

  ${({ $active }) => $active ? css`
    background-color: ${colors.white};
    color: ${colors.slate900};
    box-shadow: ${shadows.sm};
    border: 1px solid rgb(var(--app-accent-rgb) / 0.5);
  ` : css`
    background: none;
    color: ${colors.slate600};
    border: 1px solid transparent;
    &:hover { color: ${colors.slate900}; }
  `}
`;

const ResultsActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
`;

const ResultsMeta = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.slate500};
  font-weight: 500;
`;

const RunButton = styled.button<{ $variant: 'run' | 'stop' }>`
  display: inline-flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.small} 20px;
  border-radius: ${Theme.usage.borderRadius.large};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: ${shadows.sm};
  transition: all 200ms;

  ${({ $variant }) => $variant === 'run' ? css`
    background-color: ${colors.emerald500};
    color: ${colors.white};
    &:hover {
      background-color: var(--app-status-success-solid);
      transform: translateY(-1px);
    }
    &:active { transform: translateY(0); }
    &:disabled {
      opacity: 0.5;
      &:hover { transform: translateY(0); }
    }
  ` : css`
    background-color: ${colors.rose500};
    color: ${colors.white};
    &:hover {
      background-color: var(--app-status-error-solid);
      transform: translateY(-1px);
    }
    &:active { transform: translateY(0); }
  `}
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  margin: ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.large};
  border: 1px solid ${colors.slate200};
`;

const ResultsTable = styled.table`
  width: 100%;
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const TableHead = styled.thead`
  position: sticky;
  top: 0;
  background-color: ${colors.slate50};
  backdrop-filter: blur(4px);
`;

const TableTh = styled.th`
  text-align: left;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  font-size: 11px;
  font-weight: 600;
  color: ${colors.slate500};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableThIndex = styled(TableTh)`
  width: 40px;
`;

const TableRow = styled.tr`
  transition: background-color 150ms;

  &:hover {
    background-color: ${colors.slate50};
  }

  &:nth-child(even) {
    background-color: rgb(var(--app-slate50-rgb) / 0.5);
  }
`;

const TableTd = styled.td`
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  color: ${colors.slate900};
  font-family: ${fonts.mono};
  font-size: ${Theme.usage.fontSize.xxSmall};
`;

const TableTdIndex = styled.td`
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  color: ${colors.slate400};
  font-size: ${Theme.usage.fontSize.xxSmall};
`;

const EmptyResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${colors.slate400};
`;

const EmptyResultsIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${Theme.usage.borderRadius.xLarge};
  background-color: ${colors.slate100};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${Theme.usage.space.medium};
`;

const EmptyResultsTitle = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.slate600};
`;

const EmptyResultsHint = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  margin-top: ${Theme.usage.space.xxSmall};
  color: ${colors.slate500};
`;

/* ── Right Panel: AI Assistant ── */

const RightPanelContainer = styled.div`
  width: 440px;
  border-radius: ${Theme.usage.borderRadius.xLarge};
  ${glassPanelChat}
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: all 200ms;
`;

const RightPanelCollapsed = styled.div`
  width: 44px;
  border-radius: ${Theme.usage.borderRadius.xLarge};
  ${glassPanelSubtle}
  background-color: rgb(var(--app-violet-rgb) / 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${Theme.usage.space.small};
  transition: all 200ms;
`;

const RightHeader = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${Theme.usage.space.small};
  flex-shrink: 0;
`;

const RightTabGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.full};
  background-color: rgb(var(--app-violet-deep-rgb) / 0.06);
`;

const RightTab = styled.button<{ $active: boolean }>`
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  border-radius: ${Theme.usage.borderRadius.full};
  border: none;
  cursor: pointer;
  transition: all 200ms;

  ${({ $active }) => $active ? css`
    background-color: rgb(var(--app-surface-rgb) / 0.9);
    color: ${colors.foreground};
    box-shadow: ${shadows.sm};
  ` : css`
    background: none;
    color: ${colors.mutedForeground};
    &:hover { color: ${colors.foreground}; }
  `}
`;

const RightToggle = styled.button`
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  border: none;
  background: none;
  color: ${colors.mutedForeground};
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background-color: rgb(var(--app-violet-deep-rgb) / 0.06);
    color: ${colors.foreground};
  }
`;

const ChatBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow: auto;
  padding: ${Theme.usage.space.large} ${Theme.usage.space.medium};
  display: flex;
  flex-direction: column;
`;

const ChatCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ChatIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${Theme.usage.borderRadius.xLarge};
  background: linear-gradient(to bottom right, rgb(var(--app-violet-deep-rgb) / 0.15), rgb(var(--app-violet-deep-rgb) / 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${Theme.usage.space.medium};
`;

const ChatTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const ChatDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: rgb(var(--app-muted-fg-rgb) / 0.7);
  text-align: center;
  max-width: 240px;
  line-height: 1.625;
  margin-bottom: ${Theme.usage.space.large};
`;

const ChatSuggestionList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const ChatSuggestion = styled.button`
  width: 100%;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-radius: ${Theme.usage.borderRadius.large};
  background-color: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid rgb(var(--app-violet-deep-rgb) / 0.06);
  color: ${colors.foreground};
  font-size: ${Theme.usage.fontSize.xxSmall};
  text-align: left;
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background-color: rgb(var(--app-surface-rgb) / 0.8);
    border-color: rgb(var(--app-violet-deep-rgb) / 0.12);
    transform: translateY(-1px);
    box-shadow: ${shadows.sm};
  }
`;

/* ── KB Dropdown ── */

const KbDropdown = styled.div`
  position: absolute;
  bottom: 80px;
  left: ${Theme.usage.space.small};
  right: ${Theme.usage.space.small};
  background-color: rgb(var(--app-surface-rgb) / 0.95);
  backdrop-filter: blur(24px);
  border-radius: ${Theme.usage.borderRadius.xLarge};
  box-shadow: 0 8px 40px rgb(var(--app-overlay-rgb) / 0.12), 0 0 1px rgb(var(--app-overlay-rgb) / 0.08);
  z-index: 50;
  overflow: hidden;
`;

const KbDropdownHeader = styled.div`
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
`;

const KbDropdownLabel = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 600;
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const KbDropdownItem = styled.button<{ $selected: boolean }>`
  width: 100%;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  text-align: left;
  border: none;
  cursor: pointer;
  transition: all 200ms;
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  background-color: ${({ $selected }) => $selected ? 'rgb(var(--app-fg-rgb) / 0.03)' : 'transparent'};

  &:hover { background-color: rgb(var(--app-fg-rgb) / 0.04); }
`;

const KbItemName = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const KbItemDesc = styled.div`
  font-size: 11px;
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
  margin-top: ${Theme.usage.space.xxxSmall};
`;

const KbDropdownFooter = styled.div`
  border-top: 1px solid rgb(var(--app-fg-rgb) / 0.04);
`;

const KbAddButton = styled.button`
  width: 100%;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 200ms;
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};

  &:hover { background-color: rgb(var(--app-fg-rgb) / 0.04); }
`;

const KbAddName = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.ddPrimary};
`;

/* ── Chat Input ── */

const ChatInputArea = styled.div`
  padding: ${Theme.usage.space.small};
`;

const ChatInputBox = styled.div`
  border-radius: ${Theme.usage.borderRadius.xLarge};
  background-color: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid rgb(var(--app-violet-deep-rgb) / 0.08);
  transition: all 200ms;

  &:focus-within {
    border-color: rgb(var(--app-violet-deep-rgb) / 0.2);
    box-shadow: 0 0 0 3px rgb(var(--app-violet-deep-rgb) / 0.06);
  }
`;

const ChatTextarea = styled.textarea`
  width: 100%;
  padding: ${Theme.usage.space.small};
  padding-bottom: ${Theme.usage.space.xSmall};
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
  background: transparent;
  border: none;
  outline: none;
  resize: none;

  &::placeholder { color: rgb(var(--app-muted-fg-rgb) / 0.4); }
`;

const ChatToolbar = styled.div`
  padding: 0 ${Theme.usage.space.small} ${Theme.usage.space.small};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const ChatKbToggle = styled.button`
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  border: none;
  background: none;
  color: rgb(var(--app-muted-fg-rgb) / 0.5);
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background-color: rgb(var(--app-violet-deep-rgb) / 0.06);
    color: ${colors.mutedForeground};
  }
`;

const ChatKbBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.full};
  background-color: rgb(var(--app-violet-deep-rgb) / 0.07);
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.foreground};
`;

const ChatKbRemove = styled.button`
  color: rgb(var(--app-muted-fg-rgb) / 0.4);
  background: none;
  border: none;
  cursor: pointer;
  margin-left: ${Theme.usage.space.xxxSmall};
  padding: 0;
  transition: color 200ms;

  &:hover { color: ${colors.mutedForeground}; }
`;

const ChatSendButton = styled.button<{ $active: boolean }>`
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.large};
  border: none;
  cursor: pointer;
  transition: all 200ms;

  ${({ $active }) => $active ? css`
    background-color: var(--app-violet-button);
    color: ${colors.white};
    box-shadow: 0 2px 8px rgb(var(--app-violet-deep-rgb) / 0.2);
    &:hover { background-color: var(--app-violet-button-hover); }
  ` : css`
    background-color: rgb(var(--app-violet-deep-rgb) / 0.06);
    color: rgb(var(--app-muted-fg-rgb) / 0.3);
    cursor: default;
  `}
`;

/* ── Past Conversations Tab ── */

const PastConvBody = styled.div`
  flex: 1;
  overflow: auto;
`;

const PastConvSearch = styled.div`
  padding: ${Theme.usage.space.small};
  position: relative;
`;

const PastConvSearchIcon = styled(Search)`
  position: absolute;
  left: ${Theme.usage.space.large};
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: rgb(var(--app-muted-fg-rgb) / 0.4);
`;

const PastConvSearchInput = styled.input`
  font-size: ${Theme.usage.fontSize.xxSmall};
  width: 100%;
  border-radius: ${Theme.usage.borderRadius.large};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small} ${Theme.usage.space.xSmall} ${Theme.usage.space.xLarge};
  background-color: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid rgb(var(--app-violet-deep-rgb) / 0.06);
  outline: none;
  transition: background-color 200ms;

  &::placeholder { color: rgb(var(--app-muted-fg-rgb) / 0.5); }
  &:focus { background-color: rgb(var(--app-surface-rgb) / 0.7); }
`;

const PastConvItem = styled.div`
  padding: ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.large};
  cursor: pointer;
  margin-bottom: ${Theme.usage.space.xxxSmall};
  transition: all 150ms;

  &:hover { background-color: rgb(var(--app-surface-rgb) / 0.4); }
`;

const PastConvTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.xxxSmall};
`;

const PastConvTitle = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: ${Theme.usage.space.xSmall};
`;

const PastConvTimestamp = styled.span`
  font-size: 10px;
  color: rgb(var(--app-muted-fg-rgb) / 0.5);
  flex-shrink: 0;
`;

const PastConvPreview = styled.div`
  font-size: 11px;
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PastFolderButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.small} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.large};
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: all 150ms;

  &:hover { background-color: rgb(var(--app-surface-rgb) / 0.4); }
`;

const PastFolderName = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const PastFolderCount = styled.span`
  font-size: 10px;
  color: rgb(var(--app-muted-fg-rgb) / 0.4);
  margin-left: auto;
`;

const PastFolderChildren = styled.div`
  margin-left: 20px;
  padding-left: ${Theme.usage.space.small};
  border-left: 1px solid rgb(var(--app-violet-deep-rgb) / 0.08);
`;

/* ─── Mock Data ─────────────────────────────────────────────────────── */

const knowledgeBases = [
  { id: 'default', name: 'Default SQL Skills', description: 'Core SQL syntax, joins, aggregations, window functions' },
  { id: 'analytics', name: 'Analytics SQL Skills', description: 'DoorDash analytics patterns, metric definitions, reporting' },
  { id: 'wolt', name: 'Wolt SQL Skills', description: 'Wolt-specific schemas, tables, and query patterns' },
];

const queryHistoryGrouped = {
  recent: [
    { id: '1', title: 'Revenue by region and product', timestamp: '2m ago' },
    { id: '2', title: 'User analytics summary', timestamp: '1h ago' },
    { id: '3', title: 'Top products last 7 days', timestamp: '3h ago' },
  ],
  folders: [
    {
      id: 'f1', name: 'Revenue Reports', items: [
        { id: '10', title: 'Q1 revenue breakdown', timestamp: '2d ago' },
        { id: '11', title: 'Revenue by merchant tier', timestamp: '4d ago' },
        { id: '12', title: 'MoM revenue growth', timestamp: '1w ago' },
      ],
    },
    {
      id: 'f2', name: 'Delivery Metrics', items: [
        { id: '20', title: 'Courier efficiency by zone', timestamp: '1d ago' },
        { id: '21', title: 'Avg delivery time trend', timestamp: '3d ago' },
      ],
    },
    {
      id: 'f3', name: 'Customer Analytics', items: [
        { id: '30', title: 'Churn cohort analysis', timestamp: '5d ago' },
        { id: '31', title: 'DashPass retention rates', timestamp: '1w ago' },
      ],
    },
    {
      id: 'f4', name: 'Saved Queries', items: [
        { id: '40', title: 'Revenue by region and product', timestamp: '2h ago' },
        { id: '41', title: 'Customer churn analysis', timestamp: '1d ago' },
        { id: '42', title: 'Delivery performance KPIs', timestamp: '3d ago' },
        { id: '43', title: 'DashPass conversion funnel', timestamp: '5h ago' },
        { id: '44', title: 'Merchant GMV ranking', timestamp: '1d ago' },
      ],
    },
  ],
};

const pastConversationsGrouped = {
  recent: [
    { id: '1', title: 'Revenue query optimization', preview: 'How can I optimize this JOIN...', timestamp: '2h ago', messages: 4 },
    { id: '2', title: 'Customer churn SQL help', preview: 'Write a query to find churned...', timestamp: '1d ago', messages: 6 },
  ],
  folders: [
    {
      id: 'cf1', name: 'Query Optimization', items: [
        { id: '10', title: 'Index usage analysis', preview: 'Why is my query not using...', timestamp: '3d ago', messages: 5 },
        { id: '11', title: 'Partition pruning tips', preview: 'How to leverage partitions...', timestamp: '5d ago', messages: 3 },
      ],
    },
    {
      id: 'cf2', name: 'Schema Questions', items: [
        { id: '20', title: 'Table schema exploration', preview: 'What columns are in fact_orders...', timestamp: '2d ago', messages: 3 },
        { id: '21', title: 'Relationship between dims', preview: 'How do dim_region and dim_product...', timestamp: '4d ago', messages: 7 },
      ],
    },
    {
      id: 'cf3', name: 'SQL Patterns', items: [
        { id: '30', title: 'Window functions help', preview: 'How do I use ROW_NUMBER...', timestamp: '5d ago', messages: 5 },
        { id: '31', title: 'Date filtering best practices', preview: 'What is the best way to filter...', timestamp: '1w ago', messages: 8 },
      ],
    },
  ],
};

const catalogBrowse = {
  topics: [
    { id: 'finance', name: 'Finance', items: [{ id: 'ft1', name: 'fact_revenue' }, { id: 'ft2', name: 'dim_cost_center' }, { id: 'ft3', name: 'fact_payments' }, { id: 'ft4', name: 'fact_invoices' }] },
    { id: 'merchant', name: 'Merchant', items: [{ id: 'mt1', name: 'dim_merchant' }, { id: 'mt2', name: 'fact_merchant_gmv' }, { id: 'mt3', name: 'fact_merchant_ratings' }, { id: 'mt4', name: 'dim_merchant_tier' }] },
    { id: 'marketing', name: 'Marketing', items: [{ id: 'mkt1', name: 'fact_campaigns' }, { id: 'mkt2', name: 'dim_channel' }, { id: 'mkt3', name: 'fact_attribution' }] },
    { id: 'delivery', name: 'Delivery', items: [{ id: 'dt1', name: 'fact_deliveries' }, { id: 'dt2', name: 'dim_dasher' }, { id: 'dt3', name: 'fact_delivery_times' }, { id: 'dt4', name: 'dim_delivery_zone' }] },
    { id: 'customer', name: 'Customer', items: [{ id: 'ct1', name: 'dim_customer' }, { id: 'ct2', name: 'fact_orders' }, { id: 'ct3', name: 'fact_churn' }, { id: 'ct4', name: 'dim_dashpass' }] },
  ],
  metrics: [
    { id: 'guardrails', name: 'Guardrails', items: [{ id: 'g1', name: 'P99 delivery time' }, { id: 'g2', name: 'Error rate threshold' }, { id: 'g3', name: 'Customer satisfaction floor' }] },
    { id: 'capital_okrs', name: 'Capital OKRs', items: [{ id: 'o1', name: 'CAC payback period' }, { id: 'o2', name: 'LTV:CAC ratio' }, { id: 'o3', name: 'Gross margin %' }] },
    { id: 'revenue_metrics', name: 'Revenue', items: [{ id: 'r1', name: 'Total GMV' }, { id: 'r2', name: 'Net revenue' }, { id: 'r3', name: 'ARPU' }, { id: 'r4', name: 'Take rate' }] },
  ],
};

/* ─── Component ─────────────────────────────────────────────────────── */

export function SQLStudioPage() {
  const [showLanding, setShowLanding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all');
  const [sql, setSql] = useState(DEFAULT_SQL);
  const [results, setResults] = useState<Record<string, any>[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [runTime, setRunTime] = useState<string | null>(null);
  const [expandedCatalogBrowse, setExpandedCatalogBrowse] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'results' | 'chart' | 'messages'>('results');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftPanelTab, setLeftPanelTab] = useState<'history' | 'catalog'>('catalog');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'chat' | 'past'>('chat');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [expandedHistoryFolders, setExpandedHistoryFolders] = useState<Record<string, boolean>>({});
  const [expandedChatFolders, setExpandedChatFolders] = useState<Record<string, boolean>>({});
  const [kbDropdownOpen, setKbDropdownOpen] = useState(false);
  const [selectedKb, setSelectedKb] = useState(knowledgeBases[0]);
  const [chatInput, setChatInput] = useState('');
  const [centerExpanded, setCenterExpanded] = useState<'none' | 'editor' | 'results'>('none');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const [sqlTabs, setSqlTabs] = useState<{ id: string; name: string; sql: string }[]>([
    { id: 'tab-1', name: 'query.sql', sql: DEFAULT_SQL },
    { id: 'tab-2', name: 'revenue_report.sql', sql: '' },
  ]);
  const [activeFileTab, setActiveFileTab] = useState('tab-1');
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const kbDropdownRef = useRef<HTMLDivElement>(null);
  const kbButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (editingTabId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingTabId]);

  const addNewTab = useCallback(() => {
    const newId = `tab-${Date.now()}`;
    setSqlTabs(prev => [...prev, { id: newId, name: 'untitled.sql', sql: '' }]);
    setActiveFileTab(newId);
    setSql('');
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setSqlTabs(prev => {
      const next = prev.filter(t => t.id !== tabId);
      if (next.length === 0) {
        const fallback = { id: `tab-${Date.now()}`, name: 'untitled.sql', sql: '' };
        setActiveFileTab(fallback.id);
        setSql('');
        return [fallback];
      }
      if (activeFileTab === tabId) {
        const idx = prev.findIndex(t => t.id === tabId);
        const newActive = next[Math.min(idx, next.length - 1)];
        setActiveFileTab(newActive.id);
        setSql(newActive.sql);
      }
      return next;
    });
  }, [activeFileTab]);

  const switchTab = useCallback((tabId: string) => {
    setSqlTabs(prev => prev.map(t => t.id === activeFileTab ? { ...t, sql } : t));
    const target = sqlTabs.find(t => t.id === tabId);
    if (target) {
      setActiveFileTab(tabId);
      setSql(target.sql);
    }
  }, [activeFileTab, sql, sqlTabs]);

  const startRenaming = useCallback((tabId: string, currentName: string) => {
    setEditingTabId(tabId);
    setEditingTabName(currentName);
  }, []);

  const commitRename = useCallback(() => {
    if (editingTabId) {
      let name = editingTabName.trim();
      if (!name) name = 'untitled.sql';
      if (!name.endsWith('.sql')) name += '.sql';
      setSqlTabs(prev => prev.map(t => t.id === editingTabId ? { ...t, name } : t));
      setEditingTabId(null);
    }
  }, [editingTabId, editingTabName]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        kbDropdownRef.current && !kbDropdownRef.current.contains(target) &&
        kbButtonRef.current && !kbButtonRef.current.contains(target)
      ) {
        setKbDropdownOpen(false);
      }
    }
    if (kbDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [kbDropdownOpen]);

  const filteredQueries = mockSavedQueries.filter((query) => {
    const matchesSearch = query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'mine') return matchesSearch && !query.shared;
    if (filter === 'shared') return matchesSearch && query.shared;
    return matchesSearch;
  });

  const handleRun = () => {
    setIsRunning(true);
    setResults([]);
    setTimeout(() => {
      setResults(sampleResults);
      setActiveTab('results');
      setRunTime('0.34s');
      setIsRunning(false);
    }, 800);
  };

  const handleStop = () => {
    setIsRunning(false);
    setResults([]);
    setRunTime(null);
  };

  /* ── Landing Page ── */
  if (showLanding) {
    return (
      <PageContainer>
        <GradientOverlay />
        <GradientOrb variant="primary" style={{ left: '-120px', top: '-20px' }} />
        <GradientOrb variant="secondary" style={{ right: '-80px', top: '120px' }} />

        <LandingLayout>
          <LandingMain>
            <LandingInner>
              <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                <LandingHeader>
                  <LandingTitleRow>
                    <Database style={{ width: '24px', height: '24px', color: colors.ddPrimary }} />
                    <LandingTitle>SQL Studio</LandingTitle>
                  </LandingTitleRow>
                  <LandingSubtitle>
                    Create and manage SQL queries. Open a query to edit or start a new one
                  </LandingSubtitle>
                </LandingHeader>
              </motion.div>

              <LandingSearchBar>
                <LandingSearchWrapper>
                  <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgb(var(--app-muted-fg-rgb) / 0.6)' }} />
                  <Input
                    placeholder="Search queries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '40px', backgroundColor: 'rgb(var(--app-muted-rgb) / 0.5)', borderColor: colors.border }}
                  />
                </LandingSearchWrapper>
                <Button
                  style={{ backgroundColor: colors.ddPrimary, color: colors.white, gap: '8px' }}
                  onClick={() => setShowLanding(false)}
                >
                  <Plus style={{ width: '16px', height: '16px' }} />
                  New Query
                </Button>
              </LandingSearchBar>

              <LandingFilterRow>
                <Button variant="outline" size="sm" style={filter === 'all' ? { backgroundColor: colors.muted, color: colors.foreground } : {}} onClick={() => setFilter('all')}>All</Button>
                <Button variant="outline" size="sm" style={filter === 'mine' ? { backgroundColor: colors.muted, color: colors.foreground } : {}} onClick={() => setFilter('mine')}>My Queries</Button>
                <Button variant="outline" size="sm" style={filter === 'shared' ? { backgroundColor: colors.muted, color: colors.foreground } : {}} onClick={() => setFilter('shared')}>Shared with me</Button>
              </LandingFilterRow>

              {filteredQueries.length > 0 ? (
                <LandingGrid variants={staggerContainer} initial="hidden" animate="visible">
                  {filteredQueries.map((query) => (
                    <motion.div variants={staggerItem} key={query.id}>
                      <QueryCard onClick={() => setShowLanding(false)}>
                        <QueryCardHeader>
                          <QueryCardTitleRow>
                            <Database style={{ width: '20px', height: '20px', color: 'rgb(var(--app-muted-fg-rgb) / 0.6)' }} />
                            <QueryCardTitle>{query.title}</QueryCardTitle>
                          </QueryCardTitleRow>
                          {query.shared && <Users style={{ width: '16px', height: '16px', color: 'rgb(var(--app-muted-fg-rgb) / 0.6)' }} />}
                        </QueryCardHeader>
                        <QueryCardDesc>{query.description}</QueryCardDesc>
                        <QueryCardMeta>
                          <Clock style={{ width: '12px', height: '12px' }} />
                          <span>{query.lastEdited}</span>
                        </QueryCardMeta>
                      </QueryCard>
                    </motion.div>
                  ))}
                </LandingGrid>
              ) : (
                <LandingEmptyState>
                  <LandingEmptyIcon />
                  <LandingEmptyText>No queries found</LandingEmptyText>
                  <Button style={{ backgroundColor: colors.ddPrimary, color: colors.white, gap: '8px' }} onClick={() => setShowLanding(false)}>
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Create your first query
                  </Button>
                </LandingEmptyState>
              )}
            </LandingInner>
          </LandingMain>

          <LandingRightPanel>
            <LandingRightHeader>
              <LandingRightTitle>SQL Assistant</LandingRightTitle>
            </LandingRightHeader>
            <LandingRightBody>
              <LandingRightContent>
                <LandingRightCenter>
                  <AssistantIconBox>
                    <Sparkles style={{ width: '20px', height: '20px', color: colors.violet600 }} />
                  </AssistantIconBox>
                  <AssistantTitle>SQL Assistant</AssistantTitle>
                  <AssistantDescription>
                    I can help you write SQL queries, explain code, and search for tables and metrics.
                  </AssistantDescription>
                  <SuggestionList>
                    {[
                      'Write a revenue query by region',
                      'Explain the current SQL',
                      'Find customer-related tables',
                      'Optimize my query performance',
                    ].map((suggestion, index) => (
                      <SuggestionButton key={index} onClick={() => setShowLanding(false)}>
                        {suggestion}
                      </SuggestionButton>
                    ))}
                  </SuggestionList>
                </LandingRightCenter>
              </LandingRightContent>
              <LandingInputArea>
                <LandingInputBox>
                  <LandingKbRow>
                    <KbBadge>
                      <BookOpen style={{ width: '12px', height: '12px', color: colors.slate500 }} />
                      <span>Default SQL Skills</span>
                    </KbBadge>
                  </LandingKbRow>
                  <LandingTextarea placeholder="Ask about SQL, tables, or metrics..." rows={2} />
                  <LandingInputFooter>
                    <SmallIconButton><Plus style={{ width: '16px', height: '16px' }} /></SmallIconButton>
                    <SendButton><ArrowUp style={{ width: '16px', height: '16px' }} /></SendButton>
                  </LandingInputFooter>
                </LandingInputBox>
              </LandingInputArea>
            </LandingRightBody>
          </LandingRightPanel>
        </LandingLayout>
      </PageContainer>
    );
  }

  /* ── Editor View ── */
  return (
    <PageContainer>
      <GradientOverlay />
      <GradientOrb variant="primary" style={{ left: '-120px', top: '-20px' }} />
      <GradientOrb variant="secondary" style={{ right: '-80px', top: '120px' }} />

      <EditorLayout>
      {/* Left Panel */}
      {leftPanelOpen ? (
        <LeftPanelContainer>
          <PanelHeader>
            <PanelTabGroup>
              {(['history', 'catalog'] as const).map((tab) => (
                <PanelTab key={tab} $active={leftPanelTab === tab} onClick={() => setLeftPanelTab(tab)}>
                  {tab === 'history' ? <><Clock style={{ width: '12px', height: '12px' }} /> History</> : <><Database style={{ width: '12px', height: '12px' }} /> Catalog</>}
                </PanelTab>
              ))}
            </PanelTabGroup>
            <PanelToggleButton onClick={() => setLeftPanelOpen(false)}>
              <PanelLeftClose style={{ width: '16px', height: '16px' }} />
            </PanelToggleButton>
          </PanelHeader>

          <PanelBody>
            {leftPanelTab === 'history' ? (
              <PanelSection>
                <div style={{ padding: '8px' }}>
                  <PanelSearchInput type="text" placeholder="Search history..." />
                </div>

                <SectionHeader><SectionLabel>Recent</SectionLabel></SectionHeader>
                {queryHistoryGrouped.recent.map((item) => (
                  <TreeItem key={item.id}>
                    <TreeItemRow>
                      <Clock style={{ width: '14px', height: '14px', color: colors.slate400, marginTop: '2px', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <TreeItemTitle>{item.title}</TreeItemTitle>
                        <TreeItemTimestamp>{item.timestamp}</TreeItemTimestamp>
                      </div>
                    </TreeItemRow>
                  </TreeItem>
                ))}

                <SectionHeaderWithAction>
                  <SectionLabel>Folders</SectionLabel>
                  <NewFolderButton title="New folder"><Plus style={{ width: '12px', height: '12px' }} /></NewFolderButton>
                </SectionHeaderWithAction>
                {queryHistoryGrouped.folders.map((folder) => (
                  <div key={folder.id}>
                    <FolderButton onClick={() => setExpandedHistoryFolders(prev => ({ ...prev, [folder.id]: !prev[folder.id] }))}>
                      {expandedHistoryFolders[folder.id]
                        ? <FolderOpen style={{ width: '14px', height: '14px', color: colors.slate500, flexShrink: 0 }} />
                        : <Folder style={{ width: '14px', height: '14px', color: colors.slate500, flexShrink: 0 }} />
                      }
                      <FolderName>{folder.name}</FolderName>
                      <FolderCount>{folder.items.length}</FolderCount>
                      {expandedHistoryFolders[folder.id]
                        ? <ChevronDown style={{ width: '12px', height: '12px', color: colors.slate400 }} />
                        : <ChevronRight style={{ width: '12px', height: '12px', color: colors.slate400 }} />
                      }
                    </FolderButton>
                    {expandedHistoryFolders[folder.id] && (
                      <FolderChildren>
                        {folder.items.map((item) => (
                          <FolderChild key={item.id}>
                            <TreeItemTitle>{item.title}</TreeItemTitle>
                            <TreeItemTimestamp>{item.timestamp}</TreeItemTimestamp>
                          </FolderChild>
                        ))}
                      </FolderChildren>
                    )}
                  </div>
                ))}
              </PanelSection>
            ) : (
              <div>
                <CatalogSearchWrapper>
                  <CatalogSearchIcon />
                  <CatalogSearchInput
                    type="text"
                    placeholder="Search tables or metrics..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                  />
                </CatalogSearchWrapper>

                <PanelSection>
                  <SectionHeader><SectionLabel>Source of Truth Datasets</SectionLabel></SectionHeader>
                  {catalogBrowse.topics.map((topic) => (
                    <div key={topic.id}>
                      <FolderButton onClick={() => setExpandedCatalogBrowse(prev => ({ ...prev, [topic.id]: !prev[topic.id] }))}>
                        {expandedCatalogBrowse[topic.id]
                          ? <FolderOpen style={{ width: '14px', height: '14px', color: colors.slate500, flexShrink: 0 }} />
                          : <Folder style={{ width: '14px', height: '14px', color: colors.slate500, flexShrink: 0 }} />
                        }
                        <FolderName>{topic.name}</FolderName>
                        <FolderCount>{topic.items.length}</FolderCount>
                        {expandedCatalogBrowse[topic.id]
                          ? <ChevronDown style={{ width: '12px', height: '12px', color: colors.slate400 }} />
                          : <ChevronRight style={{ width: '12px', height: '12px', color: colors.slate400 }} />
                        }
                      </FolderButton>
                      {expandedCatalogBrowse[topic.id] && (
                        <FolderChildren>
                          {topic.items.map((item) => (
                            <CatalogItem key={item.id}>
                              <Table style={{ width: '12px', height: '12px', color: colors.slate400 }} />
                              <CatalogItemName $mono>{item.name}</CatalogItemName>
                            </CatalogItem>
                          ))}
                        </FolderChildren>
                      )}
                    </div>
                  ))}

                  <SectionHeader style={{ paddingTop: '20px' }}><SectionLabel>Metrics</SectionLabel></SectionHeader>
                  {catalogBrowse.metrics.map((group) => (
                    <div key={group.id}>
                      <FolderButton onClick={() => setExpandedCatalogBrowse(prev => ({ ...prev, [group.id]: !prev[group.id] }))}>
                        {expandedCatalogBrowse[group.id]
                          ? <FolderOpen style={{ width: '14px', height: '14px', color: colors.slate500, flexShrink: 0 }} />
                          : <Folder style={{ width: '14px', height: '14px', color: colors.slate500, flexShrink: 0 }} />
                        }
                        <FolderName>{group.name}</FolderName>
                        <FolderCount>{group.items.length}</FolderCount>
                        {expandedCatalogBrowse[group.id]
                          ? <ChevronDown style={{ width: '12px', height: '12px', color: colors.slate400 }} />
                          : <ChevronRight style={{ width: '12px', height: '12px', color: colors.slate400 }} />
                        }
                      </FolderButton>
                      {expandedCatalogBrowse[group.id] && (
                        <FolderChildren>
                          {group.items.map((item) => (
                            <CatalogItem key={item.id}>
                              <BarChart3 style={{ width: '12px', height: '12px', color: colors.slate400 }} />
                              <CatalogItemName>{item.name}</CatalogItemName>
                            </CatalogItem>
                          ))}
                        </FolderChildren>
                      )}
                    </div>
                  ))}
                </PanelSection>
              </div>
            )}
          </PanelBody>
        </LeftPanelContainer>
      ) : (
        <LeftPanelCollapsed>
          <PanelToggleButton onClick={() => setLeftPanelOpen(true)} title="Open sidebar">
            <PanelLeftOpen style={{ width: '16px', height: '16px' }} />
          </PanelToggleButton>
        </LeftPanelCollapsed>
      )}

      {/* Center: Editor + Results */}
      <CenterContainer>
        {centerExpanded !== 'results' && (
          <EditorCard>
            <TabBar>
              <TabList>
                {sqlTabs.map((tab) => (
                  <FileTab
                    key={tab.id}
                    $active={activeFileTab === tab.id}
                    onClick={() => switchTab(tab.id)}
                    onDoubleClick={() => startRenaming(tab.id, tab.name)}
                  >
                    {editingTabId === tab.id ? (
                      <TabRenameInput
                        ref={editInputRef}
                        type="text"
                        value={editingTabName}
                        onChange={(e) => setEditingTabName(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitRename();
                          if (e.key === 'Escape') setEditingTabId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <TabName>{tab.name}</TabName>
                    )}
                    {sqlTabs.length > 1 && (
                      <TabCloseButton onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}>
                        <X style={{ width: '12px', height: '12px' }} />
                      </TabCloseButton>
                    )}
                  </FileTab>
                ))}
                <NewTabButton onClick={addNewTab} title="New query">
                  <Plus style={{ width: '14px', height: '14px' }} />
                </NewTabButton>
              </TabList>
              <TabBarActions>
                <EngineSelect>
                  <option>Snowflake</option>
                  <option>Spark</option>
                  <option>ClickHouse</option>
                </EngineSelect>
                <ActionButton><BookmarkPlus style={{ width: '14px', height: '14px' }} /> Save</ActionButton>
                <ActionButton><Share2 style={{ width: '14px', height: '14px' }} /> Share</ActionButton>
                <ExpandButton
                  onClick={() => setCenterExpanded(prev => prev === 'editor' ? 'none' : 'editor')}
                  title={centerExpanded === 'editor' ? 'Restore panes' : 'Expand editor'}
                >
                  {centerExpanded === 'editor' ? <Minimize2 style={{ width: '16px', height: '16px' }} /> : <Maximize2 style={{ width: '16px', height: '16px' }} />}
                </ExpandButton>
              </TabBarActions>
            </TabBar>

            <MonacoWrapper $dark={isDarkMode}>
              <Editor
                height="100%"
                defaultLanguage="sql"
                value={sql}
                onChange={(value) => setSql(value || '')}
                theme={isDarkMode ? 'vs-dark' : 'vs-light'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  padding: { top: 12 },
                  renderLineHighlight: 'gutter',
                }}
              />
            </MonacoWrapper>
          </EditorCard>
        )}

        {centerExpanded !== 'editor' && (
          <ResultsCard>
            <RecommendationBanner>
              <BannerRow>
                <BannerItem>
                  <PulseDot $animate />
                  <BannerLabel>Low confidence SQL</BannerLabel>
                </BannerItem>
                <BannerItem>
                  <PulseDot />
                  <BannerDetail>Stale table: <BannerCode>fact_orders</BannerCode></BannerDetail>
                </BannerItem>
                <BannerAction>Refactor with SOT tables →</BannerAction>
              </BannerRow>
            </RecommendationBanner>

            <ResultsTabBar>
              <ResultsTabGroup>
                {(['results', 'chart', 'messages'] as const).map((tab) => (
                  <ResultsTab key={tab} $active={activeTab === tab} onClick={() => setActiveTab(tab)}>
                    {tab}
                  </ResultsTab>
                ))}
              </ResultsTabGroup>
              <ResultsActions>
                {runTime && <ResultsMeta>{results.length} rows · {runTime}</ResultsMeta>}
                {isRunning ? (
                  <RunButton $variant="stop" onClick={handleStop}>
                    <Square style={{ width: '16px', height: '16px' }} />
                    Stop
                  </RunButton>
                ) : (
                  <RunButton $variant="run" onClick={handleRun}>
                    <Play style={{ width: '16px', height: '16px' }} />
                    Run
                  </RunButton>
                )}
                <ExpandButton
                  onClick={() => setCenterExpanded(prev => prev === 'results' ? 'none' : 'results')}
                  title={centerExpanded === 'results' ? 'Restore panes' : 'Expand results'}
                >
                  {centerExpanded === 'results' ? <Minimize2 style={{ width: '16px', height: '16px' }} /> : <Maximize2 style={{ width: '16px', height: '16px' }} />}
                </ExpandButton>
              </ResultsActions>
            </ResultsTabBar>

            <TableContainer>
              {results.length > 0 ? (
                <ResultsTable>
                  <TableHead>
                    <tr>
                      <TableThIndex>#</TableThIndex>
                      {Object.keys(results[0]).map((key) => (
                        <TableTh key={key}>{key}</TableTh>
                      ))}
                    </tr>
                  </TableHead>
                  <tbody>
                    {results.map((row, i) => (
                      <TableRow key={i}>
                        <TableTdIndex>{i + 1}</TableTdIndex>
                        {Object.values(row).map((value: any, j) => (
                          <TableTd key={j}>
                            {typeof value === 'number'
                              ? value % 1 !== 0 ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value.toLocaleString()
                              : value}
                          </TableTd>
                        ))}
                      </TableRow>
                    ))}
                  </tbody>
                </ResultsTable>
              ) : (
                <EmptyResults>
                  <EmptyResultsIcon>
                    <Database style={{ width: '28px', height: '28px' }} />
                  </EmptyResultsIcon>
                  <EmptyResultsTitle>Run a query to see results</EmptyResultsTitle>
                  <EmptyResultsHint>Ctrl/Cmd + Enter</EmptyResultsHint>
                </EmptyResults>
              )}
            </TableContainer>
          </ResultsCard>
        )}
      </CenterContainer>

      {/* Right Panel: AI Assistant */}
      {rightPanelOpen ? (
        <RightPanelContainer>
          <RightHeader>
            <RightTabGroup>
              {(['chat', 'past'] as const).map((tab) => (
                <RightTab key={tab} $active={rightPanelTab === tab} onClick={() => setRightPanelTab(tab)}>
                  {tab === 'chat' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Sparkles style={{ width: '12px', height: '12px' }} /> Chat</span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare style={{ width: '12px', height: '12px' }} /> Past Chats</span>
                  )}
                </RightTab>
              ))}
            </RightTabGroup>
            <RightToggle onClick={() => setRightPanelOpen(false)}>
              <PanelRightClose style={{ width: '16px', height: '16px' }} />
            </RightToggle>
          </RightHeader>

          {rightPanelTab === 'chat' ? (
            <ChatBody>
              <ChatMessages>
                <ChatCenter>
                  <ChatIconBox>
                    <Sparkles style={{ width: '20px', height: '20px', color: '#6352af' }} />
                  </ChatIconBox>
                  <ChatTitle>SQL Assistant</ChatTitle>
                  <ChatDescription>
                    I can help you write SQL queries, explain code, and search for tables and metrics.
                  </ChatDescription>
                  <ChatSuggestionList>
                    {[
                      'Write a revenue query by region',
                      'Explain the current SQL',
                      'Find customer-related tables',
                      'Optimize my query performance',
                    ].map((suggestion, index) => (
                      <ChatSuggestion key={index} onClick={() => setChatInput(suggestion)}>
                        {suggestion}
                      </ChatSuggestion>
                    ))}
                  </ChatSuggestionList>
                </ChatCenter>
              </ChatMessages>

              {kbDropdownOpen && (
                <KbDropdown ref={kbDropdownRef}>
                  <KbDropdownHeader>
                    <KbDropdownLabel>Knowledge Bases</KbDropdownLabel>
                  </KbDropdownHeader>
                  {knowledgeBases.map((kb) => (
                    <KbDropdownItem
                      key={kb.id}
                      $selected={selectedKb.id === kb.id}
                      onClick={() => { setSelectedKb(kb); setKbDropdownOpen(false); }}
                    >
                      <BookOpen style={{ width: '16px', height: '16px', color: 'rgb(var(--app-muted-fg-rgb) / 0.5)', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <KbItemName>{kb.name}</KbItemName>
                        <KbItemDesc>{kb.description}</KbItemDesc>
                      </div>
                    </KbDropdownItem>
                  ))}
                  <KbDropdownFooter>
                    <KbAddButton>
                      <Plus style={{ width: '16px', height: '16px', color: 'rgb(var(--app-muted-fg-rgb) / 0.5)', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <KbAddName>Add Custom SQL Skills</KbAddName>
                        <KbItemDesc>Import .cursorrules, .mdc files, or paste custom SQL patterns</KbItemDesc>
                      </div>
                    </KbAddButton>
                  </KbDropdownFooter>
                </KbDropdown>
              )}

              <ChatInputArea>
                <ChatInputBox>
                  <ChatTextarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about SQL, tables, or metrics..."
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        setChatInput('');
                      }
                    }}
                  />
                  <ChatToolbar>
                    <ChatToolbarLeft>
                      <ChatKbToggle
                        ref={kbButtonRef}
                        onClick={() => setKbDropdownOpen(!kbDropdownOpen)}
                        title="Add knowledge base"
                      >
                        <Plus style={{ width: '16px', height: '16px' }} />
                      </ChatKbToggle>
                      <ChatKbBadge>
                        <BookOpen style={{ width: '12px', height: '12px', color: 'rgb(var(--app-muted-fg-rgb) / 0.6)' }} />
                        <span>{selectedKb.name}</span>
                        <ChatKbRemove onClick={() => setSelectedKb(knowledgeBases[0])}>
                          <X style={{ width: '12px', height: '12px' }} />
                        </ChatKbRemove>
                      </ChatKbBadge>
                    </ChatToolbarLeft>

                    <ChatSendButton
                      $active={!!chatInput.trim()}
                      disabled={!chatInput.trim()}
                      onClick={() => setChatInput('')}
                    >
                      <ArrowUp style={{ width: '16px', height: '16px' }} />
                    </ChatSendButton>
                  </ChatToolbar>
                </ChatInputBox>
              </ChatInputArea>
            </ChatBody>
          ) : (
            <PastConvBody>
              <PastConvSearch>
                <PastConvSearchIcon />
                <PastConvSearchInput type="text" placeholder="Search conversations..." />
              </PastConvSearch>
              <PanelSection>
                <SectionHeader><SectionLabel>Recent</SectionLabel></SectionHeader>
                {pastConversationsGrouped.recent.map((conv) => (
                  <PastConvItem key={conv.id}>
                    <PastConvTitleRow>
                      <PastConvTitle>{conv.title}</PastConvTitle>
                      <PastConvTimestamp>{conv.timestamp}</PastConvTimestamp>
                    </PastConvTitleRow>
                    <PastConvPreview>{conv.preview}</PastConvPreview>
                  </PastConvItem>
                ))}

                <SectionHeaderWithAction>
                  <SectionLabel>Folders</SectionLabel>
                  <NewFolderButton title="New folder" style={{ color: 'rgb(var(--app-muted-fg-rgb) / 0.4)' }}>
                    <Plus style={{ width: '12px', height: '12px' }} />
                  </NewFolderButton>
                </SectionHeaderWithAction>
                {pastConversationsGrouped.folders.map((folder) => (
                  <div key={folder.id}>
                    <PastFolderButton onClick={() => setExpandedChatFolders(prev => ({ ...prev, [folder.id]: !prev[folder.id] }))}>
                      {expandedChatFolders[folder.id]
                        ? <FolderOpen style={{ width: '14px', height: '14px', color: colors.mutedForeground, flexShrink: 0 }} />
                        : <Folder style={{ width: '14px', height: '14px', color: colors.mutedForeground, flexShrink: 0 }} />
                      }
                      <PastFolderName>{folder.name}</PastFolderName>
                      <PastFolderCount>{folder.items.length}</PastFolderCount>
                      {expandedChatFolders[folder.id]
                        ? <ChevronDown style={{ width: '12px', height: '12px', color: 'rgb(var(--app-muted-fg-rgb) / 0.4)' }} />
                        : <ChevronRight style={{ width: '12px', height: '12px', color: 'rgb(var(--app-muted-fg-rgb) / 0.4)' }} />
                      }
                    </PastFolderButton>
                    {expandedChatFolders[folder.id] && (
                      <PastFolderChildren>
                        {folder.items.map((item) => (
                          <PastConvItem key={item.id}>
                            <PastConvTitleRow>
                              <PastConvTitle>{item.title}</PastConvTitle>
                              <PastConvTimestamp>{item.timestamp}</PastConvTimestamp>
                            </PastConvTitleRow>
                            <PastConvPreview>{item.preview}</PastConvPreview>
                          </PastConvItem>
                        ))}
                      </PastFolderChildren>
                    )}
                  </div>
                ))}
              </PanelSection>
            </PastConvBody>
          )}
        </RightPanelContainer>
      ) : (
        <RightPanelCollapsed>
          <RightToggle onClick={() => setRightPanelOpen(true)} title="Open AI Assistant">
            <PanelRightOpen style={{ width: '16px', height: '16px' }} />
          </RightToggle>
        </RightPanelCollapsed>
      )}
      </EditorLayout>
    </PageContainer>
  );
}
