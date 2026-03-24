import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
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
import { toast } from 'sonner';
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

// Generate mock source data based on the chart type
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

  // Get all available columns
  const allColumns = sourceData.length > 0 ? Object.keys(sourceData[0]) : [];
  const visibleColumns = selectedColumns.length > 0 ? selectedColumns : allColumns;

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...sourceData];

    // Apply search filter
    if (searchQuery) {
      data = data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      data.sort((a, b) => {
        const rowA = a as Record<string, unknown>;
        const rowB = b as Record<string, unknown>;
        const aVal = rowA[sortColumn];
        const bVal = rowB[sortColumn];
        
        // Handle numeric values
        const aNum = parseFloat(String(aVal));
        const bNum = parseFloat(String(bVal));
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        // Handle string values
        return sortDirection === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return data;
  }, [sourceData, searchQuery, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
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
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-3 w-3" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="h-3 w-3" />;
    }
    return <ArrowUpDown className="h-3 w-3 text-muted-foreground" />;
  };

  const handleExport = (format: 'csv' | 'excel') => {
    toast.success(`Exporting to ${format.toUpperCase()}...`);
    // Real implementation would generate and download file
  };

  const handleOpenInMode = () => {
    toast.info('Opening in Mode Analytics...');
    // Real implementation would open in external tool
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none w-[96vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="gap-1 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <DialogTitle>Source Data: {metricTitle}</DialogTitle>
          <DialogDescription>
            View, filter, and export the underlying data for this metric
          </DialogDescription>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b">
          <div className="flex items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Column Selector */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="gap-1"
            >
              <Columns3 className="h-4 w-4" />
              Columns
              {selectedColumns.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {selectedColumns.length}
                </Badge>
              )}
            </Button>

            {/* Add Calculated Column */}
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Column
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Options */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              className="gap-1"
            >
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('excel')}
              className="gap-1"
            >
              <Download className="h-4 w-4" />
              Excel
            </Button>

            {/* Open in Mode */}
            <Button
              variant="default"
              size="sm"
              onClick={handleOpenInMode}
              className="gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Mode
            </Button>
          </div>
        </div>

        {/* Column Selector Panel */}
        {showColumnSelector && (
          <div className="p-3 bg-muted rounded-lg space-y-2">
            <div className="text-sm font-medium mb-2">Select Columns to Display</div>
            <div className="grid grid-cols-3 gap-2">
              {allColumns.map((column) => (
                <label
                  key={column}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary"
                >
                  <Checkbox
                    checked={selectedColumns.length === 0 || selectedColumns.includes(column)}
                    onCheckedChange={() => toggleColumn(column)}
                  />
                  <span className="font-mono text-xs">{column}</span>
                </label>
              ))}
            </div>
            {selectedColumns.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedColumns([])}
                className="w-full"
              >
                Reset to All Columns
              </Button>
            )}
          </div>
        )}

        {/* Data Table */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                {visibleColumns.map((column) => (
                  <TableHead
                    key={column}
                    className="cursor-pointer hover:bg-muted/50 select-none"
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs">{column}</span>
                      {getSortIcon(column)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/30">
                  {visibleColumns.map((column) => (
                    <TableCell key={column} className="font-mono text-xs">
                      {formatCellValue((row as Record<string, unknown>)[column], column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer with row count */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <span>
            Showing {filteredData.length} of {sourceData.length} rows
          </span>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="h-7"
            >
              Clear search
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
