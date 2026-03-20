import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Table, 
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';

interface SourceTableModalProps {
  open: boolean;
  onClose: () => void;
}

// Mock table data
const tableData = [
  {
    id: 1,
    order_id: 'ORD-2847',
    order_date: '2025-01-20',
    region: 'North America',
    customer_segment: 'VIP',
    order_value: 127.50,
    status: 'completed',
    delivery_time: 28
  },
  {
    id: 2,
    order_id: 'ORD-2848',
    order_date: '2025-01-20',
    region: 'North America',
    customer_segment: 'Returning',
    order_value: 45.20,
    status: 'completed',
    delivery_time: 32
  },
  {
    id: 3,
    order_id: 'ORD-2849',
    order_date: '2025-01-21',
    region: 'EMEA',
    customer_segment: 'New',
    order_value: 82.10,
    status: 'completed',
    delivery_time: 25
  },
  {
    id: 4,
    order_id: 'ORD-2850',
    order_date: '2025-01-21',
    region: 'APAC',
    customer_segment: 'Returning',
    order_value: 156.75,
    status: 'pending',
    delivery_time: null
  },
  {
    id: 5,
    order_id: 'ORD-2851',
    order_date: '2025-01-21',
    region: 'North America',
    customer_segment: 'VIP',
    order_value: 203.40,
    status: 'completed',
    delivery_time: 22
  },
  {
    id: 6,
    order_id: 'ORD-2852',
    order_date: '2025-01-22',
    region: 'EMEA',
    customer_segment: 'New',
    order_value: 67.80,
    status: 'completed',
    delivery_time: 30
  },
  {
    id: 7,
    order_id: 'ORD-2853',
    order_date: '2025-01-22',
    region: 'LATAM',
    customer_segment: 'Returning',
    order_value: 91.25,
    status: 'completed',
    delivery_time: 35
  },
  {
    id: 8,
    order_id: 'ORD-2854',
    order_date: '2025-01-23',
    region: 'APAC',
    customer_segment: 'VIP',
    order_value: 178.90,
    status: 'completed',
    delivery_time: 27
  }
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            Source Table: analytics.orders
          </DialogTitle>
          <DialogDescription>
            View and edit source data, filter rows, and create metrics from this table
          </DialogDescription>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">8,432 total rows</Badge>
            <Badge variant="outline">Last updated: 2h ago</Badge>
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center gap-2 py-3 border-b">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleAddColumn}>
            <Plus className="h-4 w-4 mr-2" />
            Add Column
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                Export to Google Sheets
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" onClick={handleCreateMetric}>
            <Sparkles className="h-4 w-4 mr-2" />
            Create Metric from View
          </Button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left w-12">
                  <Checkbox
                    checked={selectedRows.length === tableData.length}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                {columnDefs.map(col => (
                  <th key={col.key} className="p-3 text-left">
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1 hover:text-primary font-medium group"
                    >
                      {col.label}
                      <SortAsc className={`h-3 w-3 opacity-0 group-hover:opacity-100 ${
                        sortColumn === col.key ? 'opacity-100' : ''
                      }`} />
                    </button>
                  </th>
                ))}
                <th className="p-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr
                  key={row.id}
                  className={`border-t hover:bg-muted/30 ${
                    selectedRows.includes(row.id) ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="p-3">
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                    />
                  </td>
                  <td className="p-3 font-mono text-xs">{row.order_id}</td>
                  <td className="p-3 text-muted-foreground">{row.order_date}</td>
                  <td className="p-3">
                    <Badge variant="outline">{row.region}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary">{row.customer_segment}</Badge>
                  </td>
                  <td className="p-3 font-medium">
                    {editingCell?.row === row.id && editingCell?.col === 'order_value' ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          defaultValue={row.order_value}
                          className="h-7 w-24 text-sm"
                          onBlur={() => setEditingCell(null)}
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            setEditingCell(null);
                            toast.success('Value updated');
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingCell({ row: row.id, col: 'order_value' })}
                        className="hover:text-primary"
                      >
                        ${row.order_value.toFixed(2)}
                      </button>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={row.status === 'completed' ? 'default' : 'secondary'}
                      className={row.status === 'completed' ? 'bg-green-500' : ''}
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {row.delivery_time ? `${row.delivery_time} min` : '-'}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setEditingCell({ row: row.id, col: 'order_value' })}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive"
                        onClick={() => toast.success('Row deleted')}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t text-sm text-muted-foreground">
          <div>
            {selectedRows.length > 0 ? (
              <span>{selectedRows.length} row(s) selected</span>
            ) : (
              <span>Showing 8 of 8,432 rows</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <span>Page 1 of 1,054</span>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
