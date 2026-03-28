import { useState } from 'react';
import styled from 'styled-components';
import { Database, Search } from 'lucide-react';
import { colors, radius, Theme } from '@/styles/theme';
import type { SourceItem } from '@/app/data/mock/chart-builder-data';

interface SourceListProps {
  sources: SourceItem[];
  selectedSourceId: string | null;
  onSourceSelect: (source: SourceItem) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall};
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
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

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 280px;
  overflow-y: auto;
`;

const SourceRow = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xSmall};
  padding: 10px ${Theme.usage.space.xSmall};
  border-radius: ${radius.sm};
  border: 1px solid ${({ $active }) => ($active ? '#FF3A00' : 'transparent')};
  background: ${({ $active }) =>
    $active ? 'rgba(255, 58, 0, 0.06)' : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease, border-color 0.15s ease;
  width: 100%;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(255, 58, 0, 0.08)' : 'rgb(var(--app-muted-rgb) / 0.4)'};
  }
`;

const SourceIconWrapper = styled.div<{ $active: boolean }>`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: ${radius.sm};
  background: ${({ $active }) =>
    $active ? 'rgba(255, 58, 0, 0.12)' : 'rgb(var(--app-muted-rgb) / 0.5)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
`;

const SourceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const SourceName = styled.span<{ $active: boolean }>`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#FF3A00' : colors.foreground)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SourceDescription = styled.span`
  font-size: 11px;
  color: ${colors.mutedForeground};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  padding: ${Theme.usage.space.medium};
  text-align: center;
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

export function SourceList({ sources, selectedSourceId, onSourceSelect }: SourceListProps) {
  const [search, setSearch] = useState('');

  const filtered = sources.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <SearchWrapper>
        <SearchIcon />
        <SearchInput
          placeholder="Search sources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchWrapper>
      <List>
        {filtered.length === 0 ? (
          <EmptyState>No sources found</EmptyState>
        ) : (
          filtered.map((source) => {
            const isActive = source.id === selectedSourceId;
            return (
              <SourceRow key={source.id} $active={isActive} onClick={() => onSourceSelect(source)}>
                <SourceIconWrapper $active={isActive}>
                  <Database
                    style={{
                      width: 14,
                      height: 14,
                      color: isActive ? '#FF3A00' : colors.mutedForeground,
                    }}
                  />
                </SourceIconWrapper>
                <SourceInfo>
                  <SourceName $active={isActive}>{source.name}</SourceName>
                  <SourceDescription>{source.description}</SourceDescription>
                </SourceInfo>
              </SourceRow>
            );
          })
        )}
      </List>
    </Container>
  );
}
