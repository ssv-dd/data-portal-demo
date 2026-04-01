import { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useNavigate } from 'react-router';
import { Plus, BookOpen, Search, FileText, Clock, Users, FileCode2, Loader2, Check, Server, Package, Cpu } from 'lucide-react';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { LeftPanel } from '../components/layout/left-panel';
import { NotebookTemplatesPanel } from '../components/panels/notebook-templates-panel';
import { notebookTemplates } from '../data/mock/notebooks-data';
import { getAllNotebooks, createNotebook } from '../data/notebook-storage';
import { GradientOrb } from '../components/hero/gradient-orb';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel, shadows } from '@/styles/theme';

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

const ContentLayout = styled.div`
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall};
`;

const CenterPanel = styled.div`
  flex: 1;
  ${glassPanel}
  border-radius: ${Theme.usage.borderRadius.xLarge};
  border: 1px solid ${colors.border};
  overflow: auto;
`;

const CenterContent = styled.div`
  padding: ${Theme.usage.space.xLarge};
`;

const PageHeader = styled.div`
  margin-bottom: ${Theme.usage.space.xLarge};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.small};
`;

const PageTitle = styled.h1`
  font-size: ${Theme.usage.fontSize.xxLarge};
  color: ${colors.slate900};
  font-weight: 600;
`;

const PageDescription = styled.p`
  color: ${colors.slate600};
`;

const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.medium};
  margin-bottom: ${Theme.usage.space.large};
`;

const SearchWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${Theme.usage.space.small};
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
`;

const NewButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  background-color: ${colors.white};
  border: 1px solid ${colors.slate200};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.medium};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.slate900};
  cursor: pointer;
  box-shadow: ${shadows.sm};
  transition: background-color 200ms;

  &:hover {
    background-color: ${colors.slate50};
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.large};
`;

const CardsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${Theme.usage.space.large};
  margin-bottom: ${Theme.usage.space.xxLarge};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const NotebookCard = styled(motion.div)`
  background-color: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  padding: 20px;
  cursor: pointer;
  transition: box-shadow 200ms;

  &:hover {
    box-shadow: ${shadows.cardHover};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.small};
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const CardTitle = styled.h3`
  font-weight: 500;
  color: ${colors.slate900};
`;

const CardDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.slate600};
  margin-bottom: ${Theme.usage.space.medium};
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.slate600};
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const CardMetaRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
`;

const LanguageBadge = styled.span`
  padding: ${Theme.usage.space.xxxSmall} ${Theme.usage.space.xxSmall};
  background-color: ${colors.muted};
  border-radius: ${Theme.usage.borderRadius.small};
  color: ${colors.mutedForeground};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 0;
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  margin-bottom: ${Theme.usage.space.xxLarge};
`;

const EmptyIcon = styled(FileText)`
  width: 48px;
  height: 48px;
  margin: 0 auto ${Theme.usage.space.medium};
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
`;

const EmptyText = styled.p`
  color: ${colors.slate600};
  margin-bottom: ${Theme.usage.space.medium};
`;

const TemplatesSection = styled.div``;

const TemplatesTitle = styled.h2`
  font-size: ${Theme.usage.fontSize.medium};
  color: ${colors.slate900};
  margin-bottom: ${Theme.usage.space.medium};
`;

const TemplatesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${Theme.usage.space.large};

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TemplateCard = styled(motion.div)`
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  padding: ${Theme.usage.space.large};
  background-color: rgb(var(--app-surface-rgb) / 0.4);
  cursor: pointer;
  transition: box-shadow 200ms;

  &:hover {
    box-shadow: ${shadows.cardHover};
  }
`;

const TemplateIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${Theme.usage.borderRadius.large};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--app-violet-rgb) / 0.1);
  margin-bottom: ${Theme.usage.space.medium};
`;

const TemplateName = styled.h3`
  font-size: ${Theme.usage.fontSize.small};
  font-weight: 500;
  color: ${colors.slate900};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const TemplateDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.slate600};
  margin-bottom: ${Theme.usage.space.small};
`;

const TemplateCells = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.slate600};
`;

/* ── Provisioning overlay ── */

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const ProvisioningContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${Theme.usage.space.xLarge} ${Theme.usage.space.medium};
  gap: ${Theme.usage.space.large};
`;

const ProvisioningSpinner = styled(Loader2)`
  width: 36px;
  height: 36px;
  color: ${colors.violet600};
  animation: ${spin} 1s linear infinite;
`;

const ProvisioningTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
  color: ${colors.foreground};
  text-align: center;
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
  width: 100%;
`;

const StepRow = styled(motion.div)<{ $status: 'pending' | 'active' | 'done' }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border-radius: ${Theme.usage.borderRadius.large};
  background: ${({ $status }) => $status === 'active' ? 'rgb(var(--app-violet-rgb) / 0.06)' : 'transparent'};
  transition: background 300ms;
`;

const StepIconBox = styled.div<{ $status: 'pending' | 'active' | 'done' }>`
  width: 28px;
  height: 28px;
  border-radius: ${Theme.usage.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $status }) => {
    if ($status === 'done') return colors.green600;
    if ($status === 'active') return colors.violet600;
    return colors.muted;
  }};
  color: ${({ $status }) => $status === 'pending' ? colors.slate400 : colors.white};
  transition: all 300ms;
`;

const StepSpinner = styled(Loader2)`
  width: 14px;
  height: 14px;
  animation: ${spin} 1s linear infinite;
`;

const StepLabel = styled.span<{ $status: 'pending' | 'active' | 'done' }>`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: ${({ $status }) => $status === 'active' ? 600 : 400};
  color: ${({ $status }) => $status === 'pending' ? colors.slate400 : colors.foreground};
  transition: all 300ms;
`;

const PROVISIONING_STEPS = [
  { id: 'server', label: 'Provisioning server…', doneLabel: 'Server provisioned', icon: Server },
  { id: 'env', label: 'Installing environment…', doneLabel: 'Environment ready', icon: Package },
  { id: 'kernel', label: 'Starting kernel…', doneLabel: 'Kernel started', icon: Cpu },
];

const ModalFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
`;

const ModalField = styled.div``;

const ModalSelect = styled.select`
  width: 100%;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.small};
  font-size: ${Theme.usage.fontSize.xSmall};
  background-color: ${colors.background};
`;

const ModalInfoBox = styled.div`
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  padding: ${Theme.usage.space.medium};
  border-radius: ${Theme.usage.borderRadius.large};
  border: 1px solid ${colors.border};
`;

const ModalInfoText = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${Theme.usage.space.xSmall};
`;

export function NotebooksPage() {
  const navigate = useNavigate();
  const [showScaffoldModal, setShowScaffoldModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [notebookName, setNotebookName] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('ds-standard');
  const [customDockerUrl, setCustomDockerUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftTab, setLeftTab] = useState('recent');
  const [serverType, setServerType] = useState('cpu-small');
  const [notebooks, setNotebooks] = useState(getAllNotebooks);
  const [provisioning, setProvisioning] = useState(false);
  const [provisionStep, setProvisionStep] = useState(0);
  const pendingNotebookRef = useRef<{ id: string; title: string } | null>(null);

  const filteredNotebooks = notebooks.filter((notebook) => {
    const matchesSearch = notebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notebook.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'mine') return matchesSearch && !notebook.shared;
    if (filter === 'shared') return matchesSearch && notebook.shared;
    return matchesSearch;
  });

  useEffect(() => {
    if (!provisioning) return;
    if (provisionStep >= PROVISIONING_STEPS.length) {
      const nb = pendingNotebookRef.current;
      if (nb) {
        const timer = setTimeout(() => {
          setNotebooks(getAllNotebooks());
          setProvisioning(false);
          setProvisionStep(0);
          setShowScaffoldModal(false);
          navigate(`/notebook/${nb.id}?name=${encodeURIComponent(nb.title)}`);
        }, 600);
        return () => clearTimeout(timer);
      }
      return;
    }
    const delay = 800 + Math.random() * 600;
    const timer = setTimeout(() => setProvisionStep((s) => s + 1), delay);
    return () => clearTimeout(timer);
  }, [provisioning, provisionStep, navigate]);

  const handleCreateNotebook = useCallback(() => {
    const serverLabel = (document.querySelector<HTMLSelectElement>('[data-server-select]')?.selectedOptions[0]?.text) ?? serverType;
    const nb = createNotebook(notebookName, serverLabel, selectedLibrary);
    pendingNotebookRef.current = { id: nb.id, title: nb.title };
    setSelectedTemplate(null);
    setNotebookName('');
    setServerType('cpu-small');
    setProvisionStep(0);
    setProvisioning(true);
  }, [notebookName, serverType, selectedLibrary]);

  const handleTabChange = (tab: string) => {
    setLeftTab(tab);
    if (tab === 'recent') setFilter('all');
    else if (tab === 'templates') setFilter('mine');
    else if (tab === 'shared') setFilter('shared');
  };

  return (
    <PageContainer>
      <GradientOverlay />

      <GradientOrb variant="primary" style={{ left: '-120px', top: '-20px' }} />
      <GradientOrb variant="secondary" style={{ right: '-80px', top: '120px' }} />

      <ContentLayout>
      <LeftPanel
        tabs={[
          { key: 'recent', label: 'Recent', icon: Clock },
          { key: 'templates', label: 'Templates', icon: FileCode2 },
          { key: 'shared', label: 'Shared', icon: Users },
        ]}
        activeTab={leftTab}
        onTabChange={handleTabChange}
        collapsed={!leftPanelOpen}
        onToggleCollapse={() => setLeftPanelOpen(!leftPanelOpen)}
      >
        <NotebookTemplatesPanel activeTab={leftTab} />
      </LeftPanel>

      <CenterPanel>
        <CenterContent>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <PageHeader>
              <TitleRow>
                <BookOpen style={{ width: '24px', height: '24px', color: colors.violet600 }} />
                <PageTitle>Notebooks</PageTitle>
              </TitleRow>
              <PageDescription>
                Clone existing notebooks or create new ones from templates
              </PageDescription>
            </PageHeader>
          </motion.div>

          <ActionsBar>
            <SearchWrapper>
              <SearchIcon />
              <Input
                placeholder="Search notebooks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px', backgroundColor: 'rgb(var(--app-surface-rgb) / 0.5)', borderColor: colors.border }}
              />
            </SearchWrapper>
            <NewButton onClick={() => setShowScaffoldModal(true)}>
              <Plus style={{ height: '16px', width: '16px' }} />
              New Notebook
            </NewButton>
          </ActionsBar>

          <FilterRow>
            <Button variant="outline" size="sm" style={filter === 'all' ? { backgroundColor: colors.muted, color: colors.foreground } : {}} onClick={() => { setFilter('all'); setLeftTab('recent'); }}>All</Button>
            <Button variant="outline" size="sm" style={filter === 'mine' ? { backgroundColor: colors.muted, color: colors.foreground } : {}} onClick={() => { setFilter('mine'); setLeftTab('templates'); }}>My Notebooks</Button>
            <Button variant="outline" size="sm" style={filter === 'shared' ? { backgroundColor: colors.muted, color: colors.foreground } : {}} onClick={() => { setFilter('shared'); setLeftTab('shared'); }}>Shared with me</Button>
          </FilterRow>

          {filteredNotebooks.length > 0 ? (
            <CardsGrid variants={staggerContainer} initial="hidden" animate="visible">
              {filteredNotebooks.map((notebook) => (
                <NotebookCard
                  key={notebook.id}
                  variants={staggerItem}
                  onClick={() => navigate(`/notebook/${notebook.id}`)}
                >
                  <CardHeader>
                    <CardTitleRow>
                      <FileText style={{ width: '20px', height: '20px', color: 'rgb(var(--app-muted-fg-rgb) / 0.6)' }} />
                      <CardTitle>{notebook.title}</CardTitle>
                    </CardTitleRow>
                    {notebook.shared && <Users style={{ width: '16px', height: '16px', color: 'rgb(var(--app-muted-fg-rgb) / 0.6)' }} />}
                  </CardHeader>
                  <CardDescription>{notebook.description}</CardDescription>
                  <CardFooter>
                    <CardMeta>
                      <Clock style={{ width: '12px', height: '12px' }} />
                      <span>{notebook.lastEdited}</span>
                    </CardMeta>
                    <CardMetaRight>
                      <span>{notebook.cells} cells</span>
                      <LanguageBadge>{notebook.language}</LanguageBadge>
                    </CardMetaRight>
                  </CardFooter>
                </NotebookCard>
              ))}
            </CardsGrid>
          ) : (
            <EmptyState>
              <EmptyIcon />
              <EmptyText>No notebooks found</EmptyText>
              <NewButton onClick={() => setShowScaffoldModal(true)}>
                <Plus style={{ height: '16px', width: '16px' }} />
                Create your first notebook
              </NewButton>
            </EmptyState>
          )}

          <TemplatesSection>
            <TemplatesTitle>Get Started with Templates</TemplatesTitle>
            <TemplatesGrid variants={staggerContainer} initial="hidden" animate="visible">
              {notebookTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  variants={staggerItem}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setShowScaffoldModal(true);
                  }}
                >
                  <TemplateIconBox>
                    <template.icon style={{ width: '20px', height: '20px', color: colors.violet600 }} />
                  </TemplateIconBox>
                  <TemplateName>{template.name}</TemplateName>
                  <TemplateDescription>{template.description}</TemplateDescription>
                  <TemplateCells>{template.cells} pre-configured cells</TemplateCells>
                </TemplateCard>
              ))}
            </TemplatesGrid>
          </TemplatesSection>
        </CenterContent>
      </CenterPanel>

      <AIAssistantSidebar
        title="Notebook Assistant"
        contextLabel="Notebooks aware"
        knowledgeBaseId="notebooks"
        welcomeMessage="Hi! I can help you find/navigate existing notebooks, read notebook contents and summarize what the code does, execute code snippets within the chat"
        suggestions={[
          { text: 'Find my notebooks' },
          { text: 'Summarize this code' },
          { text: 'Execute code snippet' },
          { text: 'Explain this analysis' },
        ]}
        suggestedActions={['Run cell', 'Add markdown', 'Import library']}
      />
      </ContentLayout>

      <Dialog open={showScaffoldModal} onOpenChange={(open) => { if (!provisioning) setShowScaffoldModal(open); }} title="Create New Notebook">
        <DialogContent style={{ maxWidth: '512px' }}>
          {provisioning ? (
            <ProvisioningContainer
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProvisioningSpinner />
              <ProvisioningTitle>Setting up your notebook…</ProvisioningTitle>
              <StepsList>
                {PROVISIONING_STEPS.map((step, i) => {
                  const status: 'pending' | 'active' | 'done' =
                    i < provisionStep ? 'done' : i === provisionStep ? 'active' : 'pending';
                  const StepIcon = step.icon;
                  return (
                    <StepRow key={step.id} $status={status} layout>
                      <StepIconBox $status={status}>
                        {status === 'done' ? (
                          <Check style={{ width: 14, height: 14 }} />
                        ) : status === 'active' ? (
                          <StepSpinner />
                        ) : (
                          <StepIcon style={{ width: 14, height: 14 }} />
                        )}
                      </StepIconBox>
                      <StepLabel $status={status}>
                        {status === 'done' ? step.doneLabel : step.label}
                      </StepLabel>
                    </StepRow>
                  );
                })}
              </StepsList>
            </ProvisioningContainer>
          ) : (
          <ModalFormGroup>
            <ModalField>
              <Label style={{ marginBottom: '4px' }}>Notebook Name</Label>
              <Input
                placeholder="e.g., Q1 Revenue Analysis"
                value={notebookName}
                onChange={(e) => setNotebookName(e.target.value)}
              />
            </ModalField>

            <ModalField>
              <Label style={{ marginBottom: '4px' }}>Server Type</Label>
              <ModalSelect data-server-select value={serverType} onChange={(e) => setServerType(e.target.value)}>
                <optgroup label="CPU Only Notebook Server">
                  <option value="cpu-small">Small (2 CPU / 8 GB)</option>
                  <option value="cpu-medium">Medium (4 CPU / 16 GB)</option>
                  <option value="cpu-large">Large (8 CPU / 32 GB)</option>
                  <option value="cpu-xlarge">XLarge (16 CPU / 64 GB)</option>
                </optgroup>
                <optgroup label="GPU Notebook Server">
                  <option value="t4-x1">T4 x1 — 1 GPU / 12 CPUs / 48GB</option>
                  <option value="t4-x2">T4 x2 — 2 GPUs / 24 CPUs / 96GB</option>
                  <option value="t4-x4">T4 x4 — 4 GPUs / 44 CPUs / 172GB</option>
                  <option value="a10g-x1">A10G x1 — 1 GPU / 12 CPUs / 48GB</option>
                  <option value="a10g-x2">A10G x2 — 2 GPUs / 24 CPUs / 96GB</option>
                  <option value="a10g-x4">A10G x4 — 4 GPUs / 48 CPUs / 192GB</option>
                  <option value="a100-x1">A100 x1 — 1 GPU / 11 CPUs / 122GB</option>
                  <option value="a100-x2">A100 x2 — 2 GPUs / 22 CPUs / 266GB</option>
                  <option value="a100-x4">A100 x4 — 4 GPUs / 44 CPUs / 553GB</option>
                  <option value="a100-80-x1">A100 80GB (p4de) x1 — 1 GPU / 11 CPUs / 122GB</option>
                  <option value="a100-80-x2">A100 80GB (p4de) x2 — 2 GPUs / 22 CPUs / 266GB</option>
                  <option value="a100-80-x4">A100 80GB (p4de) x4 — 4 GPUs / 44 CPUs / 553GB</option>
                  <option value="h100-x1">H100 x1 — 1 GPU / 12 CPUs / 252GB</option>
                  <option value="h200-x1">H200 x1 — 1 GPU / 24 CPUs / 229GB</option>
                  <option value="h200-x2">H200 x2 — 2 GPUs / 48 CPUs / 479GB</option>
                  <option value="h200-x4">H200 x4 — 4 GPUs / 96 CPUs / 979GB</option>
                </optgroup>
              </ModalSelect>
            </ModalField>

            <ModalField>
              <Label style={{ marginBottom: '4px' }}>Environment</Label>
              <ModalSelect
                value={selectedLibrary}
                onChange={(e) => setSelectedLibrary(e.target.value)}
              >
                <option value="pyspark">PySpark (Python 3.10 + Spark Connect)</option>
                <option value="data-science">Data Science (Python 3.11, no Spark)</option>
                <option value="custom">Custom ECR Image</option>
              </ModalSelect>
            </ModalField>

            {selectedLibrary === 'custom' && (
              <ModalField>
                <Label style={{ marginBottom: '4px' }}>Custom ECR Image URL</Label>
                <Input
                  placeholder="e.g., gcr.io/doordash/my-custom-image:latest"
                  value={customDockerUrl}
                  onChange={(e) => setCustomDockerUrl(e.target.value)}
                />
              </ModalField>
            )}

            {selectedTemplate && (
              <ModalInfoBox>
                <ModalInfoText>
                  This template includes pre-configured cells for data loading, exploration, and visualization.
                </ModalInfoText>
              </ModalInfoBox>
            )}

            <ModalActions>
              <Button variant="outline" size="sm" style={{ fontSize: '13px' }} onClick={() => setShowScaffoldModal(false)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                style={{ backgroundColor: colors.ddPrimary, color: colors.white, fontSize: '13px', borderColor: colors.ddPrimary }}
                onClick={handleCreateNotebook}
                disabled={!notebookName}
              >
                Create Notebook
              </Button>
            </ModalActions>
          </ModalFormGroup>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
