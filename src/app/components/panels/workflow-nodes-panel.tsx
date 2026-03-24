import styled from 'styled-components';
import { Database, Filter, Zap, Mail, Webhook } from 'lucide-react';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';
import type { LucideIcon } from 'lucide-react';

interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  icon: LucideIcon;
  description?: string;
}

interface WorkflowNodesPanelProps {
  activeTab: string;
  onNodeClick?: (node: WorkflowNode) => void;
}

const workflows: Array<{ id: string; name: string; status: string }> = [
  { id: 'w1', name: 'Customer Segmentation', status: 'Running' },
  { id: 'w2', name: 'Data Pipeline Sync', status: 'Idle' },
  { id: 'w3', name: 'Alert Notifications', status: 'Active' },
];

const nodes: WorkflowNode[] = [
  {
    id: 'n1',
    name: 'Data Source',
    type: 'Input',
    icon: Database,
    description: 'Connect to data source',
  },
  {
    id: 'n2',
    name: 'Filter',
    type: 'Transform',
    icon: Filter,
    description: 'Filter data rows',
  },
  {
    id: 'n3',
    name: 'AI Transform',
    type: 'AI',
    icon: Zap,
    description: 'Apply AI transformation',
  },
  {
    id: 'n4',
    name: 'Email Alert',
    type: 'Output',
    icon: Mail,
    description: 'Send email notification',
  },
  {
    id: 'n5',
    name: 'Webhook',
    type: 'Output',
    icon: Webhook,
    description: 'Trigger webhook',
  },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const WorkflowCard = styled.div`
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 200ms;

  &:hover {
    background: rgba(233, 235, 239, 0.6);
    border-color: rgba(0, 0, 0, 0.06);
  }
`;

const WorkflowHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const WorkflowName = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: ${Theme.usage.space.xxxSmall} ${Theme.usage.space.xSmall};
  font-size: ${Theme.usage.fontSize.xxSmall};
  border-radius: ${Theme.usage.borderRadius.full};
  background-color: ${({ $status }) =>
    $status === 'Running' ? '#dcfce7' :
    $status === 'Active' ? '#dbeafe' :
    'rgba(236, 236, 240, 0.6)'};
  color: ${({ $status }) =>
    $status === 'Running' ? '#15803d' :
    $status === 'Active' ? '#1d4ed8' :
    colors.mutedForeground};
`;

const NodeButton = styled.button`
  width: 100%;
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 200ms;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: rgba(233, 235, 239, 0.6);
    border-color: rgba(0, 0, 0, 0.06);
  }
`;

const IconBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  background: linear-gradient(to bottom right, rgba(255, 58, 0, 0.2), rgba(168, 85, 247, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TextContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NodeName = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NodeType = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export function WorkflowNodesPanel({
  activeTab,
  onNodeClick,
}: WorkflowNodesPanelProps) {
  if (activeTab === 'workflows') {
    return (
      <Container>
        {workflows.map((workflow) => (
          <WorkflowCard key={workflow.id}>
            <WorkflowHeader>
              <WorkflowName>{workflow.name}</WorkflowName>
              <StatusBadge $status={workflow.status}>
                {workflow.status}
              </StatusBadge>
            </WorkflowHeader>
          </WorkflowCard>
        ))}
      </Container>
    );
  }

  return (
    <Container>
      {nodes.map((node) => {
        const Icon = node.icon;
        return (
          <NodeButton
            key={node.id}
            onClick={() => onNodeClick?.(node)}
          >
            <IconBox>
              <Icon style={{ width: '16px', height: '16px', color: colors.ddPrimary }} />
            </IconBox>
            <TextContent>
              <NodeName>{node.name}</NodeName>
              <NodeType>{node.type}</NodeType>
            </TextContent>
          </NodeButton>
        );
      })}
    </Container>
  );
}
