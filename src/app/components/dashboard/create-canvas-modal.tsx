import { useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogContent, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';
import { appConfig, canvasDomains } from '@/config/app.config';
import { canvasStorage } from '@/app/data/canvas-storage';
import type { Canvas } from '@/types';

interface CreateCanvasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (canvas: Canvas) => void;
}

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
`;

const FieldLabel = styled.label`
  display: block;
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const Select = styled.select`
  width: 100%;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  background: ${colors.background};
  color: ${colors.foreground};
  font-size: ${Theme.usage.fontSize.xSmall};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${colors.violet500};
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${Theme.usage.space.xSmall};
  margin-top: ${Theme.usage.space.small};
`;

export function CreateCanvasModal({ open, onOpenChange, onCreated }: CreateCanvasModalProps) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState(canvasDomains[0]);
  const [tier, setTier] = useState<'T0' | 'T1' | 'T2'>('T1');

  const handleCreate = () => {
    if (!name.trim()) return;

    const now = new Date().toISOString();
    const canvas: Canvas = {
      id: canvasStorage.generateId(),
      title: name.trim(),
      description: '',
      domain,
      tier,
      status: 'draft',
      createdAt: now,
      lastEdited: now,
      owner: appConfig.user.name,
      shared: false,
      layout: [],
    };

    canvasStorage.saveCanvas(canvas);
    onCreated(canvas);
    onOpenChange(false);

    // Reset form
    setName('');
    setDomain(canvasDomains[0]);
    setTier('T1');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Create Dashboard">
      <DialogContent style={{ maxWidth: '480px' }}>
        <DialogDescription>
          Create a new dashboard to visualize and track your metrics.
        </DialogDescription>
        <Form>
          <div>
            <FieldLabel>Name</FieldLabel>
            <Input
              placeholder="e.g. Q2 Revenue Dashboard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) handleCreate(); }}
              autoFocus
            />
          </div>
          <div>
            <FieldLabel>Domain</FieldLabel>
            <Select value={domain} onChange={(e) => setDomain(e.target.value)}>
              {canvasDomains.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </div>
          <div>
            <FieldLabel>Tier</FieldLabel>
            <Select value={tier} onChange={(e) => setTier(e.target.value as 'T0' | 'T1' | 'T2')}>
              <option value="T0">T0 — Company Critical</option>
              <option value="T1">T1 — Business Critical</option>
              <option value="T2">T2 — Team Level</option>
            </Select>
          </div>
          <Actions>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button
              style={{ backgroundColor: colors.violet600, color: colors.white }}
              onClick={handleCreate}
              disabled={!name.trim()}
            >
              Create Dashboard
            </Button>
          </Actions>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
