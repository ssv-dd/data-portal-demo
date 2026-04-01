import { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/app/lib/motion';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  ExternalLink,
  Save,
  Play,
  Square,
  RotateCcw,
  Circle,
  Download,
  Share2,
  MoreHorizontal,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { GradientOrb } from '../components/hero/gradient-orb';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel, radius } from '@/styles/theme';
import { mockNotebooks } from '../data/mock/notebooks-data';

type KernelStatus = 'starting' | 'idle' | 'busy' | 'not_connected';

const JUPYTERHUB_BASE_URL = 'https://jupyterhub.doordash.com';

const PageContainer = styled.div`
  height: 100%;
  background-color: ${colors.background};
  overflow: hidden;
  position: relative;
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgb(var(--app-fuchsia-rgb) / 0.05), transparent 35%),
              radial-gradient(circle at bottom right, rgb(var(--app-blue-rgb) / 0.05), transparent 35%);
`;

const ContentLayout = styled.div`
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall};
`;

const MainPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${glassPanel}
  border-radius: ${Theme.usage.borderRadius.xLarge};
  border: 1px solid ${colors.border};
`;

const Toolbar = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.medium};
  border-bottom: 1px solid ${colors.border};
  background: rgb(var(--app-surface-rgb) / 0.6);
  flex-shrink: 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  border: 1px solid ${colors.border};
  background: transparent;
  cursor: pointer;
  color: ${colors.foreground};
  transition: background-color 200ms;

  &:hover {
    background: rgb(var(--app-muted-rgb) / 0.5);
  }
`;

const NotebookTitle = styled.h2`
  font-size: ${Theme.usage.fontSize.small};
  font-weight: 600;
  color: ${colors.foreground};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ToolbarDivider = styled.div`
  width: 1px;
  height: 20px;
  background: ${colors.border};
`;

const KernelIndicator = styled.div<{ $status: KernelStatus }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: ${radius.full};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  border: 1px solid ${colors.border};
  background: rgb(var(--app-surface-rgb) / 0.4);
  color: ${({ $status }) => {
    switch ($status) {
      case 'idle': return colors.green600;
      case 'busy': return colors.yellow600;
      case 'starting': return colors.blue600;
      case 'not_connected': return colors.slate400;
    }
  }};
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const StatusDot = styled(Circle)<{ $status: KernelStatus }>`
  width: 8px;
  height: 8px;
  fill: currentColor;
  stroke: none;
  animation: ${({ $status }) => ($status === 'busy' || $status === 'starting') ? pulse : 'none'} 1.5s ease-in-out infinite;
`;

const ToolbarButton = styled.button<{ $variant?: 'primary' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${radius.lg};
  border: 1px solid ${({ $variant }) => $variant === 'primary' ? colors.ddPrimary : colors.border};
  background: ${({ $variant }) => $variant === 'primary' ? colors.ddPrimary : 'transparent'};
  color: ${({ $variant }) => $variant === 'primary' ? colors.white : colors.foreground};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background: ${({ $variant }) => $variant === 'primary' ? 'var(--app-dd-primary-hover, var(--app-dd-primary))' : 'rgb(var(--app-muted-rgb) / 0.5)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ToolbarIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  border: 1px solid ${colors.border};
  background: transparent;
  cursor: pointer;
  color: ${colors.foreground};
  transition: background-color 200ms;

  &:hover {
    background: rgb(var(--app-muted-rgb) / 0.5);
  }
`;

const IframeContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.medium};
  background: rgb(var(--app-surface-rgb) / 0.9);
  backdrop-filter: blur(8px);
  z-index: 20;
`;

const SpinnerIcon = styled(Loader2)`
  width: 32px;
  height: 32px;
  color: ${colors.violet600};
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-size: ${Theme.usage.fontSize.small};
  color: ${colors.slate600};
`;

const LoadingSubtext = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.slate400};
`;

const ErrorOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.medium};
  background: rgb(var(--app-surface-rgb) / 0.95);
  z-index: 20;
`;

const ErrorIcon = styled(AlertCircle)`
  width: 40px;
  height: 40px;
  color: ${colors.slate400};
`;

const ErrorTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
  color: ${colors.foreground};
`;

const ErrorDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.slate600};
  text-align: center;
  max-width: 400px;
`;

const FallbackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: ${radius.lg};
  background: ${colors.ddPrimary};
  color: ${colors.white};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  text-decoration: none;
  transition: opacity 200ms;

  &:hover {
    opacity: 0.9;
  }
`;

const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: ${radius.lg};
  border: 1px solid ${colors.border};
  background: transparent;
  color: ${colors.foreground};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  cursor: pointer;
  transition: background-color 200ms;

  &:hover {
    background: rgb(var(--app-muted-rgb) / 0.5);
  }
`;

const ErrorActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  margin-top: ${Theme.usage.space.xSmall};
`;

const NotebookIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const KERNEL_STATUS_LABELS: Record<KernelStatus, string> = {
  idle: 'Kernel Idle',
  busy: 'Kernel Busy',
  starting: 'Starting…',
  not_connected: 'Not Connected',
};

export function NotebookEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const notebook = mockNotebooks.find((n) => n.id === id);

  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [kernelStatus, setKernelStatus] = useState<KernelStatus>('starting');

  const jupyterUrl = `${JUPYTERHUB_BASE_URL}/user/${notebook?.owner ?? 'user'}/notebooks/${encodeURIComponent(notebook?.title ?? 'Untitled')}.ipynb`;

  useEffect(() => {
    if (!iframeLoading) {
      const timer = setTimeout(() => setKernelStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [iframeLoading]);

  const handleIframeLoad = useCallback(() => {
    setIframeLoading(false);
    setIframeError(false);
    setKernelStatus('starting');
  }, []);

  const handleRetry = useCallback(() => {
    setIframeLoading(true);
    setIframeError(false);
    setKernelStatus('starting');
  }, []);

  const handleRunAll = useCallback(() => {
    setKernelStatus('busy');
    setTimeout(() => setKernelStatus('idle'), 3000);
  }, []);

  const handleInterrupt = useCallback(() => {
    setKernelStatus('idle');
  }, []);

  const handleRestart = useCallback(() => {
    setKernelStatus('starting');
    setTimeout(() => setKernelStatus('idle'), 2500);
  }, []);

  if (!notebook) {
    return (
      <PageContainer>
        <GradientOverlay />
        <ContentLayout>
          <MainPanel>
            <ErrorOverlay>
              <ErrorIcon />
              <ErrorTitle>Notebook not found</ErrorTitle>
              <ErrorDescription>
                The notebook you're looking for doesn't exist or has been deleted.
              </ErrorDescription>
              <ErrorActions>
                <RetryButton onClick={() => navigate('/notebooks')}>
                  <ArrowLeft style={{ width: 14, height: 14 }} />
                  Back to Notebooks
                </RetryButton>
              </ErrorActions>
            </ErrorOverlay>
          </MainPanel>
        </ContentLayout>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <GradientOverlay />
      <GradientOrb variant="primary" style={{ left: '-200px', top: '-100px' }} />
      <GradientOrb variant="secondary" style={{ right: '-150px', bottom: '-100px' }} />

      <ContentLayout>
        <MainPanel>
          <Toolbar variants={fadeInUp} initial="hidden" animate="visible">
            <BackButton onClick={() => navigate('/notebooks')} title="Back to Notebooks">
              <ArrowLeft style={{ width: 16, height: 16 }} />
            </BackButton>

            <NotebookTitle>{notebook.title}</NotebookTitle>

            <KernelIndicator $status={kernelStatus}>
              <StatusDot $status={kernelStatus} />
              {KERNEL_STATUS_LABELS[kernelStatus]}
            </KernelIndicator>

            <ToolbarDivider />

            <ToolbarButton
              onClick={handleRunAll}
              disabled={kernelStatus === 'starting' || kernelStatus === 'not_connected'}
              title="Run All Cells"
            >
              <Play style={{ width: 14, height: 14 }} />
              Run All
            </ToolbarButton>

            <ToolbarIconButton
              onClick={handleInterrupt}
              disabled={kernelStatus !== 'busy'}
              title="Interrupt Kernel"
            >
              <Square style={{ width: 14, height: 14 }} />
            </ToolbarIconButton>

            <ToolbarIconButton onClick={handleRestart} title="Restart Kernel">
              <RotateCcw style={{ width: 14, height: 14 }} />
            </ToolbarIconButton>

            <ToolbarDivider />

            <ToolbarButton $variant="primary" title="Save Notebook">
              <Save style={{ width: 14, height: 14 }} />
              Save
            </ToolbarButton>

            <ToolbarIconButton title="Download">
              <Download style={{ width: 14, height: 14 }} />
            </ToolbarIconButton>

            <ToolbarIconButton title="Share">
              <Share2 style={{ width: 14, height: 14 }} />
            </ToolbarIconButton>

            <ToolbarDivider />

            <ToolbarIconButton
              as="a"
              href={jupyterUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in JupyterHub"
              style={{ textDecoration: 'none' }}
            >
              <ExternalLink style={{ width: 14, height: 14 }} />
            </ToolbarIconButton>

            <ToolbarIconButton title="More options">
              <MoreHorizontal style={{ width: 14, height: 14 }} />
            </ToolbarIconButton>
          </Toolbar>

          <IframeContainer>
            {iframeLoading && !iframeError && (
              <LoadingOverlay
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SpinnerIcon />
                <LoadingText>Loading notebook environment…</LoadingText>
                <LoadingSubtext>Connecting to JupyterHub server</LoadingSubtext>
              </LoadingOverlay>
            )}

            {iframeError && (
              <ErrorOverlay>
                <ErrorIcon />
                <ErrorTitle>Unable to load notebook</ErrorTitle>
                <ErrorDescription>
                  The JupyterHub server may be unavailable or the notebook session has expired.
                  You can retry or open the notebook directly in JupyterHub.
                </ErrorDescription>
                <ErrorActions>
                  <RetryButton onClick={handleRetry}>
                    <RotateCcw style={{ width: 14, height: 14 }} />
                    Retry
                  </RetryButton>
                  <FallbackLink href={jupyterUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink style={{ width: 14, height: 14 }} />
                    Open in JupyterHub
                  </FallbackLink>
                </ErrorActions>
              </ErrorOverlay>
            )}

            <NotebookIframe
              src={jupyterUrl}
              title={`Notebook: ${notebook.title}`}
              onLoad={handleIframeLoad}
              onError={() => { setIframeError(true); setIframeLoading(false); }}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
            />
          </IframeContainer>
        </MainPanel>

        <AIAssistantSidebar
          title="Notebook Assistant"
          contextLabel="Notebooks aware"
          knowledgeBaseId="notebooks"
          welcomeMessage="Hi! I can help you with this notebook — summarize cells, explain code, debug errors, or run snippets."
          suggestions={[
            { text: 'Summarize this notebook' },
            { text: 'Explain the last cell' },
            { text: 'Debug this error' },
            { text: 'Optimize this query' },
          ]}
          suggestedActions={['Run cell', 'Add markdown', 'Import library']}
        />
      </ContentLayout>
    </PageContainer>
  );
}
