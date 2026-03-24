import styled from 'styled-components';
import { FileCode2 } from 'lucide-react';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';

interface NotebookItem {
  id: string;
  title: string;
  type: string;
  icon?: string;
}

interface NotebookTemplatesPanelProps {
  activeTab: string;
  onNotebookClick?: (notebook: NotebookItem) => void;
}

const recentNotebooks: NotebookItem[] = [
  { id: '1', title: 'Delivery Analysis', type: 'Last edited yesterday' },
  { id: '2', title: 'Customer Segmentation', type: 'Last edited 3 days ago' },
  { id: '3', title: 'Revenue Trends', type: 'Last edited last week' },
];

const templateNotebooks: NotebookItem[] = [
  { id: 't1', title: 'Exploratory Data Analysis', type: 'Template' },
  { id: 't2', title: 'Time Series Forecasting', type: 'Template' },
  { id: 't3', title: 'A/B Test Analysis', type: 'Template' },
];

const sharedNotebooks: NotebookItem[] = [
  { id: 's1', title: 'Q1 Performance Review', type: 'Shared by Analytics Team' },
  { id: 's2', title: 'Customer Churn Model', type: 'Shared by Data Science' },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const NotebookButton = styled.button`
  width: 100%;
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  background: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  transition: all 200ms;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.6);
    border-color: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const IconBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  background: rgb(var(--app-muted-rgb) / 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TextContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotebookTitle = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NotebookType = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export function NotebookTemplatesPanel({
  activeTab,
  onNotebookClick,
}: NotebookTemplatesPanelProps) {
  const getNotebooks = () => {
    switch (activeTab) {
      case 'recent':
        return recentNotebooks;
      case 'templates':
        return templateNotebooks;
      case 'shared':
        return sharedNotebooks;
      default:
        return recentNotebooks;
    }
  };

  const notebooks = getNotebooks();

  return (
    <Container>
      {notebooks.map((notebook) => (
        <NotebookButton
          key={notebook.id}
          onClick={() => onNotebookClick?.(notebook)}
        >
          <IconBox>
            <FileCode2 style={{ width: '16px', height: '16px', color: colors.mutedForeground }} />
          </IconBox>
          <TextContent>
            <NotebookTitle>{notebook.title}</NotebookTitle>
            <NotebookType>{notebook.type}</NotebookType>
          </TextContent>
        </NotebookButton>
      ))}
    </Container>
  );
}
