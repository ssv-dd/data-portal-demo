import { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import {
  Search, Plus, Zap, Play, Pause, Clock, AlertCircle, Square,
  Calendar, ChevronRight, MoreVertical, Users, RefreshCw, GitBranch, Wand2,
  Sparkles, BarChart3, ArrowLeft, Settings, Copy, Trash2, ChevronDown,
  FileText, Bug, Eye, Edit3, RotateCcw, Send, BookOpen, X,
  CheckCircle, Activity, LayoutTemplate,
} from 'lucide-react';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { LeftPanel } from '../components/layout/left-panel';
import { mockWorkflows, templates, statusConfig } from '../data/mock/workflows-data';
import { GradientOrb } from '../components/hero/gradient-orb';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel, glassPanelSubtle, radius, shadows } from '@/styles/theme';
import { appConfig } from '@/config/app.config';

/* ═══════════════════════════════════════════
   SHARED STYLED COMPONENTS
   ═══════════════════════════════════════════ */

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

const StatusBadge = styled.span<{ $color: string; $bg: string; $border: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
  border: 1px solid ${({ $border }) => $border};
  flex-shrink: 0;
`;

/* ═══════════════════════════════════════════
   HOME VIEW — Styled Components
   ═══════════════════════════════════════════ */

const HomeLayout = styled.div`
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall};
`;

/* ── Left Overview Panel ── */

const OverviewPanel = styled.div`
  width: 260px;
  min-width: 240px;
  ${glassPanel}
  border-radius: ${Theme.usage.borderRadius.xLarge};
  border: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const OverviewHeader = styled.div`
  padding: ${Theme.usage.space.medium};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  flex-shrink: 0;
`;

const OverviewTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
`;

const OverviewContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: ${Theme.usage.space.small};
`;

const HealthGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: ${Theme.usage.space.small};
`;

const HealthChip = styled.button<{ $active?: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: ${({ $active, $color }) => $active ? `${$color}12` : 'rgb(var(--app-surface-rgb) / 0.4)'};
  border: 1px solid ${({ $active, $color }) => $active ? `${$color}40` : colors.border};
  border-radius: ${radius.lg};
  cursor: pointer;
  transition: all 150ms;
  text-align: left;

  &:hover {
    border-color: ${({ $color }) => `${$color}60`};
    background: ${({ $color }) => `${$color}0a`};
  }
`;

const HealthChipIcon = styled.div<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => `${$color}15`};
  flex-shrink: 0;
`;

const HealthChipLabel = styled.span`
  font-size: 11px;
  color: ${colors.mutedForeground};
  line-height: 1.2;
`;

const HealthChipValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.foreground};
  line-height: 1;
`;

const TotalRow = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: ${({ $active }) => $active ? 'rgb(var(--app-violet-rgb) / 0.06)' : 'rgb(var(--app-surface-rgb) / 0.4)'};
  border: 1px solid ${({ $active }) => $active ? colors.violet500 : colors.border};
  border-radius: ${radius.lg};
  cursor: pointer;
  transition: all 150ms;
  margin-bottom: 6px;
  width: 100%;

  &:hover {
    border-color: ${colors.violet500};
  }
`;

const SectionDivider = styled.div`
  height: 1px;
  background: ${colors.border};
  margin: ${Theme.usage.space.small} 0;
`;

const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${colors.mutedForeground};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const RecentRunItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.04);

  &:last-child { border-bottom: none; }
`;

const RecentRunTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
`;

const RecentRunTime = styled.div`
  font-size: 10px;
  color: ${colors.mutedForeground};
`;

/* ── Center Panel ── */

const CenterPanel = styled.div`
  flex: 1;
  ${glassPanel}
  border-radius: ${Theme.usage.borderRadius.xLarge};
  border: 1px solid ${colors.border};
  overflow: auto;
`;

const CenterContent = styled.div`
  padding: ${Theme.usage.space.large} ${Theme.usage.space.xLarge};
`;

/* ── Hero Entry Cards (BIG & Catchy) ── */

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const HeroRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${Theme.usage.space.medium};
  margin-bottom: ${Theme.usage.space.xLarge};
`;

const HeroCard = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 28px 24px;
  background: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid ${colors.border};
  border-radius: ${radius['2xl']};
  cursor: pointer;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  position: relative;
  overflow: hidden;
  min-height: 160px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 300ms;
    border-radius: inherit;
  }

  &:hover {
    border-color: ${colors.violet500};
    box-shadow: 0 8px 32px rgb(var(--app-violet-rgb) / 0.12), 0 2px 8px rgb(var(--app-overlay-rgb) / 0.06);
    transform: translateY(-4px);

    &::before { opacity: 1; }
  }
`;

const HeroCardScratch = styled(HeroCard)`
  background: linear-gradient(135deg, rgb(var(--app-violet-rgb) / 0.08), rgb(var(--app-cyan-rgb) / 0.06));

  &::before {
    background: linear-gradient(135deg, rgb(var(--app-violet-rgb) / 0.14), rgb(var(--app-cyan-rgb) / 0.10));
  }
`;

const HeroCardAI = styled(HeroCard)`
  background: linear-gradient(135deg, rgb(var(--app-violet-rgb) / 0.08), rgb(var(--app-cyan-rgb) / 0.06));

  &::before {
    background: linear-gradient(135deg, rgb(var(--app-violet-rgb) / 0.14), rgb(var(--app-cyan-rgb) / 0.10));
  }
`;

const HeroCardTemplates = styled(HeroCard)`
  background: linear-gradient(135deg, rgb(var(--app-violet-rgb) / 0.08), rgb(var(--app-cyan-rgb) / 0.06));

  &::before {
    background: linear-gradient(135deg, rgb(var(--app-violet-rgb) / 0.14), rgb(var(--app-cyan-rgb) / 0.10));
  }
`;

const HeroIconBox = styled.div<{ $bg?: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $bg }) => $bg ?? 'rgb(var(--app-violet-rgb) / 0.1)'};
  margin-bottom: ${Theme.usage.space.medium};
  position: relative;
`;

const HeroTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.foreground};
  margin-bottom: 6px;
`;

const HeroDesc = styled.span`
  font-size: 13px;
  color: ${colors.mutedForeground};
  line-height: 1.5;
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: auto;
  padding-top: ${Theme.usage.space.small};
  font-size: 11px;
  font-weight: 500;
  color: ${colors.violet600};
`;

/* ── Workflow Tabs + Filter ── */

const TabBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.medium};
  border-bottom: 1px solid ${colors.border};
`;

const WfTab = styled.button<{ $active: boolean }>`
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active }) => ($active ? colors.violet600 : colors.mutedForeground)};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? colors.violet600 : 'transparent')};
  cursor: pointer;
  margin-bottom: -1px;
  transition: color 150ms;
  white-space: nowrap;

  &:hover {
    color: ${({ $active }) => ($active ? colors.violet600 : colors.foreground)};
  }
`;

const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.medium};
`;

const SearchWrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid ${colors.border};
  border-radius: 9999px;
  padding: 0 16px;
  height: 40px;
  transition: border-color 200ms, box-shadow 200ms;

  &:focus-within {
    border-color: rgb(var(--app-violet-rgb) / 0.4);
    box-shadow: 0 0 0 2px rgb(var(--app-violet-rgb) / 0.08);
  }
`;

const SearchIconStyled = styled(Search)`
  width: 16px;
  height: 16px;
  color: rgb(var(--app-muted-fg-rgb) / 0.45);
  flex-shrink: 0;
  margin-right: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  height: 100%;
  font-size: 14px;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  color: ${colors.foreground};

  &::placeholder {
    color: rgb(var(--app-muted-fg-rgb) / 0.45);
  }
`;

/* ── Workflow Cards ── */

const WorkflowList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const WorkflowCard = styled(motion.div)`
  background: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid ${colors.border};
  border-radius: ${radius['2xl']};
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    border-color: rgb(var(--app-violet-rgb) / 0.2);
    box-shadow: 0 2px 12px rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const CardTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  min-width: 0;
`;

const CardTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardRightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  flex-shrink: 0;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionBtn = styled.button<{ $variant?: 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${radius.md};
  border: 1px solid ${({ $variant }) => $variant === 'danger' ? 'rgb(239 68 68 / 0.2)' : colors.border};
  background: transparent;
  color: ${({ $variant }) => $variant === 'danger' ? '#ef4444' : colors.mutedForeground};
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    background: ${({ $variant }) => $variant === 'danger' ? 'rgb(239 68 68 / 0.06)' : 'rgb(var(--app-overlay-rgb) / 0.06)'};
    color: ${({ $variant }) => $variant === 'danger' ? '#dc2626' : colors.foreground};
  }
`;

const CardDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.xSmall};
  line-height: 1.4;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.medium};
  font-size: 11px;
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const OwnerTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: ${colors.mutedForeground};
  background: rgb(var(--app-overlay-rgb) / 0.06);
  padding: 1px 6px;
  border-radius: 9999px;
`;

/* ── Kebab Dropdown ── */

const KebabWrapper = styled.div`
  position: relative;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 200px;
  ${glassPanel}
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  padding: 4px;
  z-index: 100;
  box-shadow: ${shadows.popover};
`;

const DropdownItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ $danger }) => $danger ? '#ef4444' : colors.foreground};
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 100ms;

  &:hover {
    background: ${({ $danger }) => $danger ? 'rgb(239 68 68 / 0.06)' : 'rgb(var(--app-overlay-rgb) / 0.06)'};
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: ${colors.border};
  margin: 4px 0;
`;

const SubLabel = styled.span`
  font-size: 11px;
  color: ${colors.violet600};
  margin-left: auto;
`;

/* ═══════════════════════════════════════════
   BUILDER VIEW — Styled Components
   ═══════════════════════════════════════════ */

const BuilderLayout = styled.div`
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const BuilderTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.medium};
  border-bottom: 1px solid ${colors.border};
  background: rgb(var(--app-surface-rgb) / 0.6);
  backdrop-filter: blur(12px);
  flex-shrink: 0;
  z-index: 20;
`;

const BuilderTopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${radius.md};
  border: 1px solid ${colors.border};
  background: transparent;
  color: ${colors.mutedForeground};
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    background: rgb(var(--app-overlay-rgb) / 0.06);
    color: ${colors.foreground};
  }
`;

const BuilderTitle = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
`;

const BuilderSubtitle = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const BuilderTopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BuilderBody = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const CanvasArea = styled.div`
  flex: 1;
  position: relative;
  background:
    radial-gradient(circle, rgb(var(--app-overlay-rgb) / 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
  overflow: hidden;
`;

const NodeLine = styled.div`
  position: absolute;
  height: 3px;
  border-radius: 2px;
  background: repeating-linear-gradient(
    90deg,
    ${colors.violet500},
    ${colors.violet500} 8px,
    transparent 8px,
    transparent 16px
  );
  top: 50%;
  transform: translateY(-50%);
`;

const WorkflowNode = styled(motion.div)<{ $selected?: boolean }>`
  position: absolute;
  background: rgb(var(--app-surface-rgb) / 0.9);
  border: 2px solid ${({ $selected }) => $selected ? colors.violet500 : colors.border};
  border-radius: ${radius.lg};
  padding: 16px 20px;
  min-width: 180px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  box-shadow: ${({ $selected }) => $selected ? `0 0 0 3px rgb(var(--app-violet-rgb) / 0.12), ${shadows.card}` : shadows.card};
  transition: border-color 150ms, box-shadow 150ms;

  &:hover {
    border-color: ${colors.violet400};
  }
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const NodeIcon = styled.div<{ $bg: string }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $bg }) => $bg};
`;

const NodeName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.foreground};
`;

const NodeType = styled.span`
  font-size: 11px;
  color: ${colors.mutedForeground};
  margin-left: 36px;
`;

const NodeActionBar = styled(motion.div)`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  background: rgb(var(--app-surface-rgb) / 0.95);
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  padding: 4px;
  box-shadow: ${shadows.popover};
`;

const NodeActionBtn = styled.button<{ $danger?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: ${({ $danger }) => $danger ? '#ef4444' : colors.mutedForeground};
  cursor: pointer;

  &:hover {
    background: ${({ $danger }) => $danger ? 'rgb(239 68 68 / 0.08)' : 'rgb(var(--app-overlay-rgb) / 0.08)'};
    color: ${({ $danger }) => $danger ? '#dc2626' : colors.foreground};
  }
`;

const ChatSidePanel = styled.div`
  width: 380px;
  min-width: 340px;
  border-left: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  background: rgb(var(--app-surface-rgb) / 0.3);
`;

/* ── Add Node Toolbar ── */

const AddNodeToolbar = styled.div`
  position: absolute;
  top: ${Theme.usage.space.small};
  left: ${Theme.usage.space.small};
  display: flex;
  gap: 4px;
  z-index: 10;
`;

const ToolbarBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${radius.md};
  border: 1px solid ${colors.border};
  background: rgb(var(--app-surface-rgb) / 0.8);
  color: ${colors.mutedForeground};
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 150ms;

  &:hover {
    background: rgb(var(--app-surface-rgb) / 1);
    color: ${colors.foreground};
    border-color: ${colors.violet400};
  }
`;

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

const MY_TEAM = 'Data Platform';
type WorkflowTabKey = 'all' | 'mine' | 'team';
type PageView = 'home' | 'builder';

export function AIWorkflowsPage() {
  const [view, setView] = useState<PageView>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [workflowTab, setWorkflowTab] = useState<WorkflowTabKey>('all');
  const [openKebab, setOpenKebab] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>('ai_agent_1');
  const [execPeriod, setExecPeriod] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [pastRunsWorkflow, setPastRunsWorkflow] = useState<string | null>(null);
  const [openRunKebab, setOpenRunKebab] = useState<string | null>(null);
  const kebabRef = useRef<HTMLDivElement>(null);
  const runKebabRef = useRef<HTMLDivElement>(null);

  // Close kebab on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
        setOpenKebab(null);
      }
    }
    if (openKebab) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [openKebab]);

  // Close run kebab on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (runKebabRef.current && !runKebabRef.current.contains(e.target as Node)) {
        setOpenRunKebab(null);
      }
    }
    if (openRunKebab) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [openRunKebab]);

  // ─── Filtering Logic ───
  const tabFiltered = mockWorkflows.filter((wf) => {
    if (workflowTab === 'mine') return wf.owner === appConfig.user.name;
    if (workflowTab === 'team') return wf.team === MY_TEAM;
    return true;
  });

  const filteredWorkflows = tabFiltered.filter((wf) => {
    const matchesSearch = wf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && wf.status === statusFilter;
  });

  const globalCounts = {
    all: mockWorkflows.length,
    active: mockWorkflows.filter(w => w.status === 'active').length,
    paused: mockWorkflows.filter(w => w.status === 'paused').length,
    failed: mockWorkflows.filter(w => w.status === 'failed').length,
    completed: mockWorkflows.filter(w => w.status === 'completed').length,
  };

  // ─── Builder View ───
  if (view === 'builder') {
    return (
      <PageContainer>
        <GradientOverlay />
        <BuilderLayout>
          <BuilderTopBar>
            <BuilderTopLeft>
              <BackButton onClick={() => setView('home')}>
                <ArrowLeft style={{ width: 16, height: 16 }} />
              </BackButton>
              <div>
                <BuilderTitle>New AI Workflow</BuilderTitle>
                <BuilderSubtitle style={{ display: 'block' }}>Describe your workflow and AI will build it</BuilderSubtitle>
              </div>
            </BuilderTopLeft>
            <BuilderTopRight>
              <ActionBtn title="Save"><Settings style={{ width: 14, height: 14 }} /></ActionBtn>
              <ActionBtn title="Run"><Play style={{ width: 14, height: 14 }} /></ActionBtn>
              <ActionBtn title="Duplicate"><Copy style={{ width: 14, height: 14 }} /></ActionBtn>
            </BuilderTopRight>
          </BuilderTopBar>

          <BuilderBody>
            <CanvasArea>
              <AddNodeToolbar>
                <ToolbarBtn title="Add Node"><Plus style={{ width: 16, height: 16 }} /></ToolbarBtn>
                <ToolbarBtn title="Zoom"><ChevronDown style={{ width: 16, height: 16 }} /></ToolbarBtn>
              </AddNodeToolbar>

              {/* Connecting Lines */}
              <NodeLine style={{ left: 'calc(15% + 180px)', width: 'calc(50% - 15% - 180px - 90px)', top: '50%' }} />
              <NodeLine style={{ left: 'calc(50% + 90px)', width: 'calc(85% - 50% - 90px - 90px)', top: '50%' }} />

              {/* SQL Query Node */}
              <WorkflowNode
                style={{ left: '15%', top: '50%', transform: 'translateY(-50%)' }}
                $selected={selectedNode === 'sql_query_1'}
                onClick={() => setSelectedNode('sql_query_1')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <NodeHeader>
                  <NodeIcon $bg="rgb(56 142 246 / 0.12)">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2338a1db'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E" alt="" style={{ width: 16, height: 16 }} />
                  </NodeIcon>
                  <NodeName>sql_query_1</NodeName>
                  <ChevronDown style={{ width: 14, height: 14, color: colors.mutedForeground, marginLeft: 'auto' }} />
                </NodeHeader>
                <NodeType>Snowflake Query</NodeType>
              </WorkflowNode>

              {/* AI Agent Node */}
              <WorkflowNode
                style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                $selected={selectedNode === 'ai_agent_1'}
                onClick={() => setSelectedNode('ai_agent_1')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AnimatePresence>
                  {selectedNode === 'ai_agent_1' && (
                    <NodeActionBar
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                    >
                      <NodeActionBtn title="Configure"><Settings style={{ width: 14, height: 14 }} /></NodeActionBtn>
                      <NodeActionBtn title="Run"><Play style={{ width: 14, height: 14 }} /></NodeActionBtn>
                      <NodeActionBtn title="Duplicate"><Copy style={{ width: 14, height: 14 }} /></NodeActionBtn>
                      <NodeActionBtn $danger title="Delete"><Trash2 style={{ width: 14, height: 14 }} /></NodeActionBtn>
                    </NodeActionBar>
                  )}
                </AnimatePresence>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: colors.violet500, borderRadius: '3px 0 0 3px' }} />
                <NodeHeader>
                  <NodeIcon $bg="rgb(var(--app-violet-rgb) / 0.12)">
                    <Sparkles style={{ width: 14, height: 14, color: colors.violet600 }} />
                  </NodeIcon>
                  <NodeName>ai_agent_1</NodeName>
                  <ChevronDown style={{ width: 14, height: 14, color: colors.mutedForeground, marginLeft: 'auto' }} />
                </NodeHeader>
                <NodeType>AI</NodeType>
              </WorkflowNode>

              {/* Slack Node */}
              <WorkflowNode
                style={{ right: '15%', top: '50%', transform: 'translateY(-50%)' }}
                $selected={selectedNode === 'slack_1'}
                onClick={() => setSelectedNode('slack_1')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <NodeHeader>
                  <NodeIcon $bg="rgb(74 21 75 / 0.1)">
                    <Send style={{ width: 14, height: 14, color: '#4a154b' }} />
                  </NodeIcon>
                  <NodeName>slack_1</NodeName>
                  <ChevronDown style={{ width: 14, height: 14, color: colors.mutedForeground, marginLeft: 'auto' }} />
                </NodeHeader>
                <NodeType>Send Slack Message</NodeType>
              </WorkflowNode>
            </CanvasArea>

            {/* Right: AI Chat */}
            <ChatSidePanel>
              <AIAssistantSidebar
                title="Workflow Assistant"
                contextLabel="Workflows aware"
                knowledgeBaseId="workflows"
                welcomeMessage="Describe your workflow and I'll build it. Try: 'Query NPS scores daily and send a Slack summary'"
                suggestions={[
                  { text: 'Create a scheduled report' },
                  { text: 'Set up an anomaly alert' },
                  { text: 'Add a new node' },
                  { text: 'Debug this workflow' },
                ]}
                suggestedActions={['Add node', 'Run workflow', 'Save draft']}
              />
            </ChatSidePanel>
          </BuilderBody>
        </BuilderLayout>
      </PageContainer>
    );
  }

  // ─── Home View ───
  return (
    <PageContainer>
      <GradientOverlay />
      <GradientOrb variant="primary" style={{ left: '-120px', top: '-20px' }} />
      <GradientOrb variant="secondary" style={{ right: '-80px', top: '120px' }} />

      <HomeLayout>
        {/* Left: Overview Panel (collapsible) */}
        <LeftPanel
          tabs={[]}
          activeTab=""
          onTabChange={() => {}}
          collapsed={!leftPanelOpen}
          onToggleCollapse={() => setLeftPanelOpen(!leftPanelOpen)}
          title="Overview"
        >
          <div>
            {/* Platform Health */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: Theme.usage.space.small }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: colors.foreground }}>Platform Health</span>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b98180' }} />
            </div>

            {/* Active Workflows */}
            <TotalRow $active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HealthChipIcon $color="#FF3A00">
                  <Zap style={{ width: 13, height: 13, color: '#FF3A00' }} />
                </HealthChipIcon>
                <HealthChipLabel>Active Workflows</HealthChipLabel>
              </div>
              <HealthChipValue>{globalCounts.all}</HealthChipValue>
            </TotalRow>

            {/* Total Executions with time toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgb(var(--app-surface-rgb) / 0.4)', border: `1px solid ${colors.border}`, borderRadius: radius.lg, marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HealthChipIcon $color={colors.violet600}>
                  <Activity style={{ width: 13, height: 13, color: colors.violet600 }} />
                </HealthChipIcon>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <HealthChipLabel>Total Executions</HealthChipLabel>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                    {(['Day', 'Week', 'Month'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setExecPeriod(p)}
                        style={{
                          fontSize: '9px',
                          fontWeight: execPeriod === p ? 600 : 400,
                          color: execPeriod === p ? colors.violet600 : colors.mutedForeground,
                          background: execPeriod === p ? 'rgb(var(--app-violet-rgb) / 0.08)' : 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '1px 5px',
                          cursor: 'pointer',
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <HealthChipValue>{execPeriod === 'Day' ? 24 : execPeriod === 'Week' ? 156 : 642}</HealthChipValue>
            </div>

            <SectionLabel style={{ marginTop: Theme.usage.space.xSmall }}>Status</SectionLabel>

            {/* Status chips in 2x2 grid */}
            <HealthGrid>
              {[
                { key: 'active', label: 'Running', count: globalCounts.active, icon: Play, color: '#10b981' },
                { key: 'paused', label: 'Paused', count: globalCounts.paused, icon: Pause, color: '#f59e0b' },
                { key: 'failed', label: 'Failed', count: globalCounts.failed, icon: AlertCircle, color: '#ef4444' },
                { key: 'completed', label: 'Completed', count: globalCounts.completed, icon: CheckCircle, color: '#3b82f6' },
              ].map((s) => (
                <HealthChip
                  key={s.key}
                  $active={statusFilter === s.key}
                  $color={s.color}
                  onClick={() => setStatusFilter(statusFilter === s.key ? 'all' : s.key)}
                >
                  <HealthChipIcon $color={s.color}>
                    <s.icon style={{ width: 12, height: 12, color: s.color }} />
                  </HealthChipIcon>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <HealthChipValue style={{ fontSize: '14px' }}>{s.count}</HealthChipValue>
                    <HealthChipLabel>{s.label}</HealthChipLabel>
                  </div>
                </HealthChip>
              ))}
            </HealthGrid>

            <SectionDivider />

            <SectionLabel>Your Recent Activity</SectionLabel>
            {mockWorkflows.slice(0, 5).map((wf) => (
              <RecentRunItem
                key={wf.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setView('builder')}
              >
                <div style={{ minWidth: 0 }}>
                  <RecentRunTitle>{wf.title}</RecentRunTitle>
                  <RecentRunTime>Last edited {wf.lastRun}</RecentRunTime>
                </div>
                <ChevronRight style={{ width: 14, height: 14, color: colors.mutedForeground, flexShrink: 0 }} />
              </RecentRunItem>
            ))}
          </div>
        </LeftPanel>

        {/* Center: Main Content */}
        <CenterPanel>
          <CenterContent>
            {/* Hero Entry Cards — BIG */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <HeroRow>
                <HeroCardScratch
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <HeroIconBox>
                    <Plus style={{ width: 22, height: 22, color: colors.violet600 }} />
                  </HeroIconBox>
                  <HeroTitle>Create from Scratch</HeroTitle>
                  <HeroDesc>Start a blank workflow with drag-and-drop nodes</HeroDesc>
                  <HeroBadge>
                    <GitBranch style={{ width: 12, height: 12 }} />
                    Visual builder
                  </HeroBadge>
                </HeroCardScratch>

                <HeroCardAI
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setView('builder')}
                >
                  <HeroIconBox $bg="linear-gradient(135deg, rgb(var(--app-purple-rgb) / 0.15), rgb(var(--app-fuchsia-rgb) / 0.1))">
                    <Sparkles style={{ width: 22, height: 22, color: colors.violet600 }} />
                  </HeroIconBox>
                  <HeroTitle>Create with AI</HeroTitle>
                  <HeroDesc>Describe what you need and AI builds it for you</HeroDesc>
                  <HeroBadge>
                    <Wand2 style={{ width: 12, height: 12 }} />
                    AI-powered
                  </HeroBadge>
                </HeroCardAI>

                <HeroCardTemplates
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <HeroIconBox $bg="rgb(var(--app-blue-rgb, 59 130 246) / 0.1)">
                    <LayoutTemplate style={{ width: 22, height: 22, color: '#3b82f6' }} />
                  </HeroIconBox>
                  <HeroTitle>Browse Templates</HeroTitle>
                  <HeroDesc>Pick from {templates.length} ready-made workflow templates</HeroDesc>
                  <HeroBadge style={{ color: '#3b82f6' }}>
                    <BookOpen style={{ width: 12, height: 12 }} />
                    {templates.length} templates
                  </HeroBadge>
                </HeroCardTemplates>
              </HeroRow>
            </motion.div>

            {/* Workflow Tabs */}
            <TabBar>
              <WfTab $active={workflowTab === 'all'} onClick={() => setWorkflowTab('all')}>
                All ({mockWorkflows.length})
              </WfTab>
              <WfTab $active={workflowTab === 'mine'} onClick={() => setWorkflowTab('mine')}>
                My Workflows ({mockWorkflows.filter(w => w.owner === appConfig.user.name).length})
              </WfTab>
              <WfTab $active={workflowTab === 'team'} onClick={() => setWorkflowTab('team')}>
                My Team ({mockWorkflows.filter(w => w.team === MY_TEAM).length})
              </WfTab>
            </TabBar>

            {/* Search */}
            <ActionsBar>
              <SearchWrapper>
                <SearchIconStyled />
                <SearchInput
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchWrapper>
            </ActionsBar>

            {/* Workflow List */}
            {filteredWorkflows.length > 0 ? (
              <WorkflowList variants={staggerContainer} initial="hidden" animate="visible">
                {filteredWorkflows.map((wf) => {
                  const st = statusConfig[wf.status];
                  const StIcon = st.icon;
                  return (
                    <WorkflowCard key={wf.id} variants={staggerItem}>
                      <CardTopRow>
                        <CardTitleGroup>
                          <CardTitle>{wf.title}</CardTitle>
                          {wf.shared && <Users style={{ width: 13, height: 13, color: 'rgb(var(--app-muted-fg-rgb) / 0.5)' }} />}
                        </CardTitleGroup>
                        <CardRightGroup>
                          <CardActions>
                            {wf.status === 'active' && (
                              <ActionBtn title="Pause"><Pause style={{ width: 13, height: 13 }} /></ActionBtn>
                            )}
                            {wf.status === 'paused' && (
                              <ActionBtn title="Resume"><Play style={{ width: 13, height: 13 }} /></ActionBtn>
                            )}
                            {wf.status === 'failed' && (
                              <ActionBtn title="Retry"><RefreshCw style={{ width: 13, height: 13 }} /></ActionBtn>
                            )}
                            {(wf.status === 'active' || wf.status === 'paused') && (
                              <ActionBtn $variant="danger" title="Stop"><Square style={{ width: 11, height: 11 }} /></ActionBtn>
                            )}

                            {/* Kebab Dropdown */}
                            <KebabWrapper ref={openKebab === wf.id ? kebabRef : undefined}>
                              <ActionBtn
                                title="More options"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenKebab(openKebab === wf.id ? null : wf.id);
                                }}
                                style={openKebab === wf.id ? { background: 'rgb(var(--app-overlay-rgb) / 0.08)', color: colors.foreground } : {}}
                              >
                                <MoreVertical style={{ width: 13, height: 13 }} />
                              </ActionBtn>
                              <AnimatePresence>
                                {openKebab === wf.id && (
                                  <DropdownMenu
                                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                                    transition={{ duration: 0.12 }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <DropdownItem onClick={() => setOpenKebab(null)}>
                                      <Eye style={{ width: 14, height: 14, color: colors.mutedForeground }} />
                                      View Logs
                                    </DropdownItem>
                                    <DropdownItem onClick={() => { setOpenKebab(null); setPastRunsWorkflow(wf.id); }}>
                                      <Clock style={{ width: 14, height: 14, color: colors.mutedForeground }} />
                                      Past Runs
                                      <SubLabel style={{ color: colors.mutedForeground, fontSize: '10px' }}>7 days</SubLabel>
                                    </DropdownItem>
                                    <DropdownItem onClick={() => setOpenKebab(null)}>
                                      <Bug style={{ width: 14, height: 14, color: colors.violet600 }} />
                                      Troubleshoot with AI
                                      <SubLabel>
                                        <Sparkles style={{ width: 10, height: 10 }} />
                                      </SubLabel>
                                    </DropdownItem>
                                    <DropdownDivider />
                                    <DropdownItem onClick={() => setOpenKebab(null)}>
                                      <Edit3 style={{ width: 14, height: 14, color: colors.mutedForeground }} />
                                      Edit Workflow
                                    </DropdownItem>
                                    <DropdownItem onClick={() => setOpenKebab(null)}>
                                      <RotateCcw style={{ width: 14, height: 14, color: colors.mutedForeground }} />
                                      Restart Workflow
                                    </DropdownItem>
                                    <DropdownDivider />
                                    <DropdownItem $danger onClick={() => setOpenKebab(null)}>
                                      <Trash2 style={{ width: 14, height: 14 }} />
                                      Delete Workflow
                                    </DropdownItem>
                                  </DropdownMenu>
                                )}
                              </AnimatePresence>
                            </KebabWrapper>
                          </CardActions>
                          <StatusBadge $color={st.color} $bg={st.bg} $border={st.borderColor}>
                            <StIcon style={{ width: 11, height: 11 }} />
                            {st.label}
                          </StatusBadge>
                        </CardRightGroup>
                      </CardTopRow>
                      <CardDescription>{wf.description}</CardDescription>
                      <CardMeta>
                        <MetaItem><Calendar style={{ width: 11, height: 11 }} /> {wf.schedule}</MetaItem>
                        <MetaItem><Clock style={{ width: 11, height: 11 }} /> {wf.lastRun}</MetaItem>
                        {wf.nextRun && <MetaItem><RefreshCw style={{ width: 11, height: 11 }} /> {wf.nextRun}</MetaItem>}
                        <MetaItem>{wf.steps} steps</MetaItem>
                        <MetaItem>{wf.successRate}</MetaItem>
                        <OwnerTag><Users style={{ width: 10, height: 10 }} /> {wf.owner}</OwnerTag>
                        {wf.team && <OwnerTag>{wf.team}</OwnerTag>}
                      </CardMeta>
                    </WorkflowCard>
                  );
                })}
              </WorkflowList>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 0', color: colors.mutedForeground }}>
                <Zap style={{ width: 40, height: 40, color: 'rgb(var(--app-muted-fg-rgb) / 0.4)', marginBottom: '12px' }} />
                <p>No workflows match your filters</p>
              </div>
            )}
          </CenterContent>
        </CenterPanel>

        {/* Past Runs Side Panel */}
        <AnimatePresence>
          {pastRunsWorkflow && (() => {
            const wf = mockWorkflows.find(w => w.id === pastRunsWorkflow);
            if (!wf) return null;
            const mockRuns = [
              { id: 'r1', time: 'Today, 6:02 AM', duration: '2m 14s', status: 'active' as const },
              { id: 'r2', time: 'Yesterday, 6:01 AM', duration: '2m 08s', status: 'active' as const },
              { id: 'r3', time: 'Yesterday, 12:00 PM', duration: '1m 55s', status: 'active' as const },
              { id: 'r4', time: 'Apr 29, 6:03 AM', duration: '2m 22s', status: 'active' as const },
              { id: 'r5', time: 'Apr 28, 6:00 AM', duration: '3m 41s', status: 'failed' as const },
              { id: 'r6', time: 'Apr 28, 6:45 AM', duration: '2m 10s', status: 'active' as const },
              { id: 'r7', time: 'Apr 27, 6:01 AM', duration: '2m 05s', status: 'active' as const },
              { id: 'r8', time: 'Apr 26, 6:02 AM', duration: '1m 58s', status: 'active' as const },
              { id: 'r9', time: 'Apr 25, 6:00 AM', duration: '2m 30s', status: 'paused' as const },
              { id: 'r10', time: 'Apr 25, 7:00 AM', duration: '2m 12s', status: 'active' as const },
            ];
            return (
              <motion.div
                key="past-runs"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 340, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  minWidth: 0,
                  overflow: 'hidden',
                  borderRadius: Theme.usage.borderRadius.xLarge,
                  border: `1px solid ${colors.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--app-glass-bg)',
                  backdropFilter: 'blur(24px)',
                }}
              >
                <div style={{ padding: Theme.usage.space.medium, borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: colors.foreground, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Past Runs</div>
                    <div style={{ fontSize: '11px', color: colors.mutedForeground, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wf.title} — Last 7 days</div>
                  </div>
                  <ActionBtn onClick={() => setPastRunsWorkflow(null)} title="Close">
                    <X style={{ width: 14, height: 14 }} />
                  </ActionBtn>
                </div>
                <div style={{ flex: 1, overflow: 'auto', padding: Theme.usage.space.small }}>
                  {mockRuns.map((run) => {
                    const st = statusConfig[run.status];
                    const StIcon = st.icon;
                    const isFailed = run.status === 'failed';
                    return (
                      <div
                        key={run.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 8px',
                          borderBottom: `1px solid rgb(var(--app-overlay-rgb) / 0.04)`,
                          borderRadius: radius.md,
                          transition: 'background 100ms',
                          background: isFailed ? 'rgb(239 68 68 / 0.04)' : 'transparent',
                        }}
                        onMouseEnter={(e) => { if (!isFailed) e.currentTarget.style.background = 'rgb(var(--app-overlay-rgb) / 0.04)'; }}
                        onMouseLeave={(e) => { if (!isFailed) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: st.color, flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: 500, color: colors.foreground }}>{run.time}</div>
                            <div style={{ fontSize: '11px', color: colors.mutedForeground }}>Duration: {run.duration}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          {/* Kebab for each run */}
                          <KebabWrapper ref={openRunKebab === run.id ? runKebabRef : undefined}>
                            <ActionBtn
                              title="Actions"
                              onClick={(e) => { e.stopPropagation(); setOpenRunKebab(openRunKebab === run.id ? null : run.id); }}
                              style={{
                                width: 24, height: 24,
                                ...(openRunKebab === run.id ? { background: 'rgb(var(--app-overlay-rgb) / 0.08)', color: colors.foreground } : {}),
                              }}
                            >
                              <MoreVertical style={{ width: 12, height: 12 }} />
                            </ActionBtn>
                            <AnimatePresence>
                              {openRunKebab === run.id && (
                                <DropdownMenu
                                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                                  transition={{ duration: 0.12 }}
                                  style={{ right: 0, minWidth: 180 }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <DropdownItem onClick={() => setOpenRunKebab(null)}>
                                    <Eye style={{ width: 13, height: 13, color: colors.mutedForeground }} />
                                    View Logs
                                  </DropdownItem>
                                  {isFailed && (
                                    <DropdownItem onClick={() => setOpenRunKebab(null)}>
                                      <Bug style={{ width: 13, height: 13, color: colors.violet600 }} />
                                      Troubleshoot with AI
                                      <SubLabel><Sparkles style={{ width: 10, height: 10 }} /></SubLabel>
                                    </DropdownItem>
                                  )}
                                  <DropdownItem onClick={() => setOpenRunKebab(null)}>
                                    <RotateCcw style={{ width: 13, height: 13, color: colors.mutedForeground }} />
                                    Rerun
                                  </DropdownItem>
                                  <DropdownItem onClick={() => setOpenRunKebab(null)}>
                                    <Copy style={{ width: 13, height: 13, color: colors.mutedForeground }} />
                                    Copy Run ID
                                  </DropdownItem>
                                </DropdownMenu>
                              )}
                            </AnimatePresence>
                          </KebabWrapper>
                          <StatusBadge $color={st.color} $bg={st.bg} $border={st.borderColor} style={{ fontSize: '10px', padding: '1px 6px' }}>
                            <StIcon style={{ width: 10, height: 10 }} />
                            {run.status === 'active' ? 'Success' : st.label}
                          </StatusBadge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </HomeLayout>
    </PageContainer>
  );
}
