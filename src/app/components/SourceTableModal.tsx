import { useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Download, 
  Plus, 
  Filter, 
  SortAsc, 
  Sparkles,
  Edit3,
  Trash2,
  Check
} from 'lucide-react';
import { Menu, Theme } from '@doordash/prism-react';
import { Checkbox } from './ui/checkbox';
import { colors, radius } from '@/styles/theme';
import { toast } from '@/app/lib/toast';

interface SourceTableModalProps {
  open: boolean;
  onClose: () => void;
}

const tableData = [
  { id: 1, order_id: 'ORD-2847', order_date: '2025-01-20', region: 'North America', customer_segment: 'VIP', order_value: 127.50, status: 'completed', delivery_time: 28 },
  { id: 2, order_id: 'ORD-2848', order_date: '2025-01-20', region: 'North America', customer_segment: 'Returning', order_value: 45.20, status: 'completed', delivery_time: 32 },
  { id: 3, order_id: 'ORD-2849', order_date: '2025-01-21', region: 'EMEA', customer_segment: 'New', order_value: 82.10, status: 'completed', delivery_time: 25 },
  { id: 4, order_id: 'ORD-2850', order_date: '2025-01-21', region: 'APAC', customer_segment: 'Returning', order_value: 156.75, status: 'pending', delivery_time: null },
  { id: 5, order_id: 'ORD-2851', order_date: '2025-01-21', region: 'North America', customer_segment: 'VIP', order_value: 203.40, status: 'completed', delivery_time: 22 },
  { id: 6, order_id: 'ORD-2852', order_date: '2025-01-22', region: 'EMEA', customer_segment: 'New', order_value: 67.80, status: 'completed', delivery_time: 30 },
  { id: 7, order_id: 'ORD-2853', order_date: '2025-01-22', region: 'LATAM', customer_segment: 'Returning', order_value: 91.25, status: 'completed', delivery_time: 35 },
  { id: 8, order_id: 'ORD-2854', order_date: '2025-01-23', region: 'APAC', customer_segment: 'VIP', order_value: 178.90, status: 'completed', delivery_time: 27 },
];

const columnDefs = [
  { key: 'order_id', label: 'Order ID', type: 'text' },
  { key: 'order_date', label: 'Order Date', type: 'date' },
  { key: 'region', label: 'Region', type: 'category' },
  { key: 'customer_segment', label: 'Customer Segment', type: 'category' },
  { key: 'order_value', label: 'Order Value', type: 'number' },
  { key: 'status', label: 'Status', type: 'category' },
  { key: 'delivery_time', label: 'Delivery Time (min)', type: 'number' }
];

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-top: ${Theme.usage.space.xSmall};
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.small} 0;
  border-bottom: 1px solid ${colors.border};
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
  height: 16px;
  width: 16px;
  color: ${colors.mutedForeground};
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
`;

const StyledTable = styled.table`
  width: 100%;
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const TableHead = styled.thead`
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ThCell = styled.th`
  padding: ${Theme.usage.space.small};
  text-align: left;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${colors.primary};
  }
`;

const SortIcon = styled(SortAsc)<{ $visible: boolean }>`
  height: 12px;
  width: 12px;
  opacity: ${({ $visible }) => $visible ? 1 : 0};

  ${SortButton}:hover & {
    opacity: 1;
  }
`;

const TdCell = styled.td`
  padding: ${Theme.usage.space.small};
`;

const MonoCell = styled(TdCell)`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: ${Theme.usage.fontSize.xxSmall};
`;

const MutedCell = styled(TdCell)`
  color: ${colors.mutedForeground};
`;

const BoldCell = styled(TdCell)`
  font-weight: 500;
`;

const StyledRow = styled.tr<{ $selected: boolean }>`
  border-top: 1px solid ${colors.border};
  background-color: ${({ $selected }) => $selected ? 'rgb(var(--app-primary-rgb) / 0.05)' : 'transparent'};

  &:hover {
    background-color: rgb(var(--app-muted-rgb) / 0.3);
  }
`;

const EditWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const GreenBtn = styled.button`
  color: ${colors.green600};
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    color: #15803d;
  }
`;

const ValueBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${colors.primary};
  }
`;

const ActionsCell = styled(TdCell)`
  & > div {
    display: flex;
    align-items: center;
    gap: ${Theme.usage.space.xxSmall};
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${Theme.usage.space.small};
  border-top: 1px solid ${colors.border};
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

export function SourceTableModal({ open, onClose }: SourceTableModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(tableData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleAddColumn = () => {
    toast.success('Column added: "Custom Calculation"');
  };

  const handleExport = () => {
    toast.success('Exporting 8 rows to CSV...');
  };

  const handleCreateMetric = () => {
    toast.success('Creating metric from current view...');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose} title="Source Table: analytics.orders">
      <DialogContent style={{ maxWidth: '95vw', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <DialogDescription>
            View and edit source data, filter rows, and create metrics from this table
          </DialogDescription>
          <BadgeRow>
            <Badge variant="secondary">8,432 total rows</Badge>
            <Badge variant="outline">Last updated: 2h ago</Badge>
          </BadgeRow>

        <Toolbar>
          <SearchWrapper>
            <SearchIcon />
            <Input
              placeholder="Search table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </SearchWrapper>
          
          <Button variant="outline" size="sm">
            <Filter style={{ height: '16px', width: '16px', marginRight: '8px' }} />
            Filter
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleAddColumn}>
            <Plus style={{ height: '16px', width: '16px', marginRight: '8px' }} />
            Add Column
          </Button>
          
          <Menu
            renderMenuControl={({ describedBy, accessibilityAttributes }) => (
              <Button variant="outline" size="sm" aria-describedby={describedBy} {...accessibilityAttributes}>
                <Download style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Export
              </Button>
            )}
            content={[
              { title: 'Export as CSV', onClick: handleExport },
              { title: 'Export as Excel', onClick: handleExport },
              { title: 'Export to Google Sheets', onClick: handleExport },
            ]}
          />

          <Button size="sm" onClick={handleCreateMetric}>
            <Sparkles style={{ height: '16px', width: '16px', marginRight: '8px' }} />
            Create Metric from View
          </Button>
        </Toolbar>

        <TableWrapper>
          <StyledTable>
            <TableHead>
              <tr>
                <ThCell style={{ width: '48px' }}>
                  <Checkbox
                    checked={selectedRows.length === tableData.length}
                    onCheckedChange={handleSelectAll}
                  />
                </ThCell>
                {columnDefs.map(col => (
                  <ThCell key={col.key}>
                    <SortButton onClick={() => handleSort(col.key)}>
                      {col.label}
                      <SortIcon $visible={sortColumn === col.key} />
                    </SortButton>
                  </ThCell>
                ))}
                <ThCell style={{ width: '96px' }} />
              </tr>
            </TableHead>
            <tbody>
              {tableData.map((row) => (
                <StyledRow key={row.id} $selected={selectedRows.includes(row.id)}>
                  <TdCell>
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                    />
                  </TdCell>
                  <MonoCell>{row.order_id}</MonoCell>
                  <MutedCell>{row.order_date}</MutedCell>
                  <TdCell>
                    <Badge variant="outline">{row.region}</Badge>
                  </TdCell>
                  <TdCell>
                    <Badge variant="secondary">{row.customer_segment}</Badge>
                  </TdCell>
                  <BoldCell>
                    {editingCell?.row === row.id && editingCell?.col === 'order_value' ? (
                      <EditWrapper>
                        <Input
                          type="number"
                          defaultValue={row.order_value}
                          style={{ height: '28px', width: '96px', fontSize: '14px' }}
                          onBlur={() => setEditingCell(null)}
                          autoFocus
                        />
                        <GreenBtn
                          onClick={() => {
                            setEditingCell(null);
                            toast.success('Value updated');
                          }}
                        >
                          <Check style={{ height: '16px', width: '16px' }} />
                        </GreenBtn>
                      </EditWrapper>
                    ) : (
                      <ValueBtn onClick={() => setEditingCell({ row: row.id, col: 'order_value' })}>
                        ${row.order_value.toFixed(2)}
                      </ValueBtn>
                    )}
                  </BoldCell>
                  <TdCell>
                    <Badge
                      variant={row.status === 'completed' ? 'default' : 'secondary'}
                      style={row.status === 'completed' ? { backgroundColor: '#22c55e' } : {}}
                    >
                      {row.status}
                    </Badge>
                  </TdCell>
                  <MutedCell>
                    {row.delivery_time ? `${row.delivery_time} min` : '-'}
                  </MutedCell>
                  <ActionsCell>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{ height: '28px', width: '28px', padding: 0 }}
                        onClick={() => setEditingCell({ row: row.id, col: 'order_value' })}
                      >
                        <Edit3 style={{ height: '12px', width: '12px' }} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{ height: '28px', width: '28px', padding: 0, color: colors.destructive }}
                        onClick={() => toast.success('Row deleted')}
                      >
                        <Trash2 style={{ height: '12px', width: '12px' }} />
                      </Button>
                    </div>
                  </ActionsCell>
                </StyledRow>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>

        <Footer>
          <div>
            {selectedRows.length > 0 ? (
              <span>{selectedRows.length} row(s) selected</span>
            ) : (
              <span>Showing 8 of 8,432 rows</span>
            )}
          </div>
          <PaginationRow>
            <Button variant="outline" size="sm">Previous</Button>
            <span>Page 1 of 1,054</span>
            <Button variant="outline" size="sm">Next</Button>
          </PaginationRow>
        </Footer>
      </DialogContent>
    </Dialog>
  );
}
