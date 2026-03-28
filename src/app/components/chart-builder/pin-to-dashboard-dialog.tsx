import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter } from '@/app/components/ui/dialog';
import { ModalSize } from '@/app/components/ui/dialog';
import { canvasStorage } from '@/app/data/canvas-storage';
import { colors, radius, Theme } from '@/styles/theme';
import type { Canvas } from '@/types';

interface PinToDashboardDialogProps {
  open: boolean;
  onClose: () => void;
  onPin: (canvasId: string) => void;
  preSelectedDashboardId?: string | null;
}

type DialogTab = 'existing' | 'new';

const DOMAINS = ['Marketplace', 'Logistics', 'CX', 'Finance', 'DashPass', 'Growth', 'Other'];
const TIERS: Canvas['tier'][] = ['T0', 'T1', 'T2'];

// --- Styled components ---

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.border};
  margin-bottom: ${Theme.usage.space.small};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active }) => ($active ? '#FF3A00' : colors.mutedForeground)};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#FF3A00' : 'transparent')};
  cursor: pointer;
  margin-bottom: -1px;
  transition: color 0.15s ease, border-color 0.15s ease;

  &:hover {
    color: ${({ $active }) => ($active ? '#FF3A00' : colors.foreground)};
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 10px;
  width: 14px;
  height: 14px;
  color: ${colors.mutedForeground};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 10px 8px 32px;
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
  background: rgb(var(--app-muted-rgb) / 0.4);
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm};
  outline: none;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: ${colors.mutedForeground};
  }

  &:focus {
    border-color: #FF3A00;
  }
`;

const DashboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 280px;
  overflow-y: auto;
`;

const DashboardRow = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px ${Theme.usage.space.xSmall};
  border-radius: ${radius.sm};
  border: 1px solid ${({ $active }) => ($active ? '#FF3A00' : colors.border)};
  background: ${({ $active }) => ($active ? 'rgba(255, 58, 0, 0.05)' : 'transparent')};
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease, background 0.15s ease;
  width: 100%;

  &:hover {
    border-color: ${({ $active }) => ($active ? '#FF3A00' : colors.borderStrong)};
    background: ${({ $active }) =>
      $active ? 'rgba(255, 58, 0, 0.07)' : 'rgb(var(--app-muted-rgb) / 0.3)'};
  }
`;

const DashboardName = styled.span<{ $active: boolean }>`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#FF3A00' : colors.foreground)};
`;

const DashboardMeta = styled.span`
  font-size: 11px;
  color: ${colors.mutedForeground};
`;

const EmptyState = styled.div`
  padding: ${Theme.usage.space.medium};
  text-align: center;
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

// Form elements for New Dashboard tab

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const Label = styled.label`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const TextInput = styled.input`
  padding: 8px 10px;
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
  background: rgb(var(--app-muted-rgb) / 0.4);
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm};
  outline: none;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: ${colors.mutedForeground};
  }

  &:focus {
    border-color: #FF3A00;
  }
`;

const SelectInput = styled.select`
  padding: 8px 10px;
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
  background: rgb(var(--app-muted-rgb) / 0.4);
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm};
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #FF3A00;
  }
`;

const RowGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${Theme.usage.space.xSmall};
`;

const PinButton = styled.button<{ $disabled?: boolean }>`
  padding: 8px 18px;
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: #fff;
  background: ${({ $disabled }) => ($disabled ? colors.mutedForeground : '#FF3A00')};
  border: none;
  border-radius: ${radius.sm};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: opacity 0.15s ease;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const CancelButton = styled.button`
  padding: 8px 18px;
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.mutedForeground};
  background: transparent;
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm};
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: ${colors.borderStrong};
    color: ${colors.foreground};
  }
`;

const ErrorText = styled.span`
  font-size: 11px;
  color: var(--app-error, #f87171);
`;

// --- Component ---

export function PinToDashboardDialog({
  open,
  onClose,
  onPin,
  preSelectedDashboardId,
}: PinToDashboardDialogProps) {
  const [activeTab, setActiveTab] = useState<DialogTab>('existing');
  const [search, setSearch] = useState('');
  const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(preSelectedDashboardId ?? null);
  const [canvases, setCanvases] = useState<Canvas[]>([]);

  // New dashboard form
  const [newName, setNewName] = useState('');
  const [newDomain, setNewDomain] = useState(DOMAINS[0]);
  const [newTier, setNewTier] = useState<Canvas['tier']>('T1');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (open) {
      setCanvases(canvasStorage.getCanvases());
      setSelectedCanvasId(preSelectedDashboardId ?? null);
      setSearch('');
      setNewName('');
      setFormError('');
    }
  }, [open, preSelectedDashboardId]);

  const filtered = canvases.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const widgetCountMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of canvases) {
      map[c.id] = canvasStorage.getCanvasWidgets(c.id).length;
    }
    return map;
  }, [canvases]);

  const handlePinToExisting = () => {
    if (!selectedCanvasId) return;
    onPin(selectedCanvasId);
    onClose();
  };

  const handleCreateAndPin = () => {
    if (!newName.trim()) {
      setFormError('Dashboard name is required');
      return;
    }
    setFormError('');
    const newCanvas: Canvas = {
      id: canvasStorage.generateId(),
      title: newName.trim(),
      description: '',
      domain: newDomain,
      tier: newTier,
      status: 'draft',
      createdAt: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
      owner: 'You',
      shared: false,
      layout: [],
    };
    canvasStorage.saveCanvas(newCanvas);
    onPin(newCanvas.id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => { if (!v) onClose(); }}
      title="Pin to Dashboard"
      size={ModalSize.medium}
    >
      <DialogContent>
        <TabBar>
          <Tab $active={activeTab === 'existing'} onClick={() => setActiveTab('existing')}>
            Existing Dashboard
          </Tab>
          <Tab $active={activeTab === 'new'} onClick={() => setActiveTab('new')}>
            New Dashboard
          </Tab>
        </TabBar>

        {activeTab === 'existing' && (
          <>
            <SearchWrapper>
              <SearchIcon />
              <SearchInput
                placeholder="Search dashboards..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchWrapper>
            <DashboardList>
              {filtered.length === 0 ? (
                <EmptyState>No dashboards found</EmptyState>
              ) : (
                filtered.map((canvas) => {
                  const isActive = canvas.id === selectedCanvasId;
                  const widgetCount = widgetCountMap[canvas.id] ?? 0;
                  return (
                    <DashboardRow
                      key={canvas.id}
                      $active={isActive}
                      onClick={() => setSelectedCanvasId(canvas.id)}
                    >
                      <DashboardName $active={isActive}>{canvas.title}</DashboardName>
                      <DashboardMeta>
                        {canvas.domain} / {canvas.tier} — {widgetCount} widget{widgetCount !== 1 ? 's' : ''}
                      </DashboardMeta>
                    </DashboardRow>
                  );
                })
              )}
            </DashboardList>
            <DialogFooter style={{ marginTop: Theme.usage.space.small }}>
              <CancelButton onClick={onClose}>Cancel</CancelButton>
              <PinButton
                $disabled={!selectedCanvasId}
                disabled={!selectedCanvasId}
                onClick={handlePinToExisting}
              >
                Pin to Dashboard
              </PinButton>
            </DialogFooter>
          </>
        )}

        {activeTab === 'new' && (
          <>
            <FormGroup>
              <Label htmlFor="new-dashboard-name">Dashboard Name *</Label>
              <TextInput
                id="new-dashboard-name"
                placeholder="e.g. Q2 Revenue Metrics"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (formError) setFormError('');
                }}
              />
              {formError && <ErrorText>{formError}</ErrorText>}
            </FormGroup>
            <RowGroup>
              <FormGroup>
                <Label htmlFor="new-dashboard-domain">Domain</Label>
                <SelectInput
                  id="new-dashboard-domain"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </SelectInput>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="new-dashboard-tier">Tier</Label>
                <SelectInput
                  id="new-dashboard-tier"
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value as Canvas['tier'])}
                >
                  {TIERS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </SelectInput>
              </FormGroup>
            </RowGroup>
            <DialogFooter style={{ marginTop: Theme.usage.space.small }}>
              <CancelButton onClick={onClose}>Cancel</CancelButton>
              <PinButton
                $disabled={!newName.trim()}
                disabled={!newName.trim()}
                onClick={handleCreateAndPin}
              >
                Create &amp; Pin
              </PinButton>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
