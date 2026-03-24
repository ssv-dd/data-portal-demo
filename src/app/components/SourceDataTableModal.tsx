import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Download,
  ExternalLink,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Columns3,
  ArrowLeft,
} from 'lucide-react';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';
import { toast } from '@/app/lib/toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Checkbox } from './ui/checkbox';

interface SourceDataTableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricTitle: string;
  chartData: any[];
}

const generateSourceData = (metricTitle: string, chartData: any[]) => {
  if (metricTitle.includes('MAU')) {
    return chartData.map((row, index) => ({
      month: row.name,
      mau: row.value,
      new_users: Math.floor(row.value * 0.15),
      returning_users: Math.floor(row.value * 0.85),
      dau_avg: Math.floor(row.value * 0.28),
      wau_avg: Math.floor(row.value * 0.62),
      region: index % 2 === 0 ? 'US' : 'International',
      platform_mobile_pct: (65 + Math.random() * 10).toFixed(1),
      platform_web_pct: (35 - Math.random() * 10).toFixed(1),
    }));
  } else if (metricTitle.includes('GOV')) {
    return chartData.map((row, index) => ({
      month: row.name,
      gov_millions: row.gov,
      aov: row.aov,
      order_count: Math.floor((row.gov * 1000000) / row.aov),
      subtotal_pct: (82 + Math.random() * 3).toFixed(1),
      delivery_fee_pct: (8 + Math.random() * 2).toFixed(1),
      tip_pct: (7 + Math.random() * 2).toFixed(1),
      tax_pct: (3 + Math.random() * 1).toFixed(1),
      region: index % 2 === 0 ? 'US' : 'International',
    }));
  } else if (metricTitle.includes('HQDR')) {
    return chartData.map((row, index) => ({
      month: row.name,
      hqdr_pct: row.value,
      total_deliveries: Math.floor(2000000 + Math.random() * 500000),
      on_time_pct: (row.value + Math.random() * 2).toFixed(1),
      accurate_orders_pct: (row.value + Math.random() * 1.5).toFixed(1),
      no_complaints_pct: (row.value - Math.random() * 1).toFixed(1),
      avg_dasher_rating: (4.6 + Math.random() * 0.3).toFixed(2),
      region: index % 2 === 0 ? 'US' : 'International',
    }));
  }
  return [];
};

type SortDirection = 'asc' | 'desc' | null;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${Theme.usage.space.small};
  padding-bottom: ${Theme.usage.space.small};
  border-bottom: 1px solid ${colors.border};
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  flex: 1;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 384px;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${Theme.usage.space.small};
  top: 50%;
  transform: translateY(-50%);
  height: 16px;
  width: 16px;
  color: ${colors.mutedForeground};
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const ColumnSelectorPanel = styled.div`
  padding: ${Theme.usage.space.small};
  background-color: ${colors.muted};
  border-radius: ${radius.lg};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const ColumnSelectorTitle = styled.div`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const ColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${Theme.usage.space.xSmall};
`;

const ColumnLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  font-size: ${Theme.usage.fontSize.xSmall};
  cursor: pointer;

  &:hover {
    color: ${colors.primary};
  }
`;

const ColumnMonoText = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: ${Theme.usage.fontSize.xxSmall};
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
`;

const SortableHead = styled(TableHead)`
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: rgba(236, 236, 240, 0.5);
  }
`;

const SortHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${Theme.usage.space.xSmall};
  border-top: 1px solid ${colors.border};
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

export function SourceDataTableModal({
  open,
  onOpenChange,
  metricTitle,
  chartData,
}: SourceDataTableModalProps) {
  const sourceData = useMemo(() => generateSourceData(metricTitle, chartData), [metricTitle, chartData]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const allColumns = sourceData.length > 0 ? Object.keys(sourceData[0]) : [];
  const visibleColumns = selectedColumns.length > 0 ? selectedColumns : allColumns;

  const filteredData = useMemo(() => {
    let data = [...sourceData];

    if (searchQuery) {
      data = data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (sortColumn && sortDirection) {
      data.sort((a, b) => {
        const rowA = a as Record<string, unknown>;
        const rowB = b as Record<string, unknown>;
        const aVal = rowA[sortColumn];
        const bVal = rowB[sortColumn];
        
        const aNum = parseFloat(String(aVal));
        const bNum = parseFloat(String(bVal));
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        return sortDirection === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return data;
  }, [sourceData, searchQuery, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown style={{ height: '12px', width: '12px', color: colors.mutedForeground }} />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp style={{ height: '12px', width: '12px' }} />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown style={{ height: '12px', width: '12px' }} />;
    }
    return <ArrowUpDown style={{ height: '12px', width: '12px', color: colors.mutedForeground }} />;
  };

  const handleExport = (format: 'csv' | 'excel') => {
    toast.success(`Exporting to ${format.toUpperCase()}...`);
  };

  const handleOpenInMode = () => {
    toast.info('Opening in Mode Analytics...');
  };

  const toggleColumn = (column: string) => {
    setSelectedColumns((prev) => {
      if (prev.includes(column)) {
        return prev.filter((c) => c !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  const formatCellValue = (value: any, column: string) => {
    if (typeof value === 'number') {
      if (column.includes('pct')) {
        return `${value}%`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={`Source Data: ${metricTitle}`}>
      <DialogContent style={{ maxWidth: 'none', width: '96vw', height: '90vh', display: 'flex', flexDirection: 'column' }}>
          <HeaderRow>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              style={{ gap: '4px', marginLeft: '-8px' }}
            >
              <ArrowLeft style={{ height: '16px', width: '16px' }} />
              Back
            </Button>
          </HeaderRow>
          <DialogDescription>
            View, filter, and export the underlying data for this metric
          </DialogDescription>

        <Toolbar>
          <ToolbarLeft>
            <SearchWrapper>
              <SearchIcon />
              <Input
                placeholder="Search data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </SearchWrapper>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              style={{ gap: '4px' }}
            >
              <Columns3 style={{ height: '16px', width: '16px' }} />
              Columns
              {selectedColumns.length > 0 && (
                <Badge variant="secondary" style={{ marginLeft: '4px', padding: '0 4px', fontSize: '12px' }}>
                  {selectedColumns.length}
                </Badge>
              )}
            </Button>

            <Button variant="outline" size="sm" style={{ gap: '4px' }}>
              <Plus style={{ height: '16px', width: '16px' }} />
              Add Column
            </Button>
          </ToolbarLeft>

          <ToolbarRight>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              style={{ gap: '4px' }}
            >
              <Download style={{ height: '16px', width: '16px' }} />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('excel')}
              style={{ gap: '4px' }}
            >
              <Download style={{ height: '16px', width: '16px' }} />
              Excel
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleOpenInMode}
              style={{ gap: '4px' }}
            >
              <ExternalLink style={{ height: '16px', width: '16px' }} />
              Open in Mode
            </Button>
          </ToolbarRight>
        </Toolbar>

        {showColumnSelector && (
          <ColumnSelectorPanel>
            <ColumnSelectorTitle>Select Columns to Display</ColumnSelectorTitle>
            <ColumnGrid>
              {allColumns.map((column) => (
                <ColumnLabel key={column}>
                  <Checkbox
                    checked={selectedColumns.length === 0 || selectedColumns.includes(column)}
                    onCheckedChange={() => toggleColumn(column)}
                  />
                  <ColumnMonoText>{column}</ColumnMonoText>
                </ColumnLabel>
              ))}
            </ColumnGrid>
            {selectedColumns.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedColumns([])}
                style={{ width: '100%' }}
              >
                Reset to All Columns
              </Button>
            )}
          </ColumnSelectorPanel>
        )}

        <TableWrapper>
          <Table>
            <TableHeader style={{ position: 'sticky', top: 0, backgroundColor: colors.background, zIndex: 10 }}>
              <TableRow>
                {visibleColumns.map((column) => (
                  <SortableHead
                    key={column}
                    onClick={() => handleSort(column)}
                  >
                    <SortHeaderContent>
                      <ColumnMonoText>{column}</ColumnMonoText>
                      {getSortIcon(column)}
                    </SortHeaderContent>
                  </SortableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index}>
                  {visibleColumns.map((column) => (
                    <TableCell key={column} style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '12px' }}>
                      {formatCellValue((row as Record<string, unknown>)[column], column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>

        <Footer>
          <span>
            Showing {filteredData.length} of {sourceData.length} rows
          </span>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              style={{ height: '28px' }}
            >
              Clear search
            </Button>
          )}
        </Footer>
      </DialogContent>
    </Dialog>
  );
}
