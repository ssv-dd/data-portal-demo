import React from 'react';
import styled from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors } from '@/styles/theme';

const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  caption-side: bottom;
  font-size: ${Theme.usage.fontSize.xSmall};
  border-collapse: collapse;
`;

const StyledTableHeader = styled.thead`
  border-bottom: 1px solid ${colors.border};

  tr {
    border-bottom: 1px solid ${colors.border};
  }
`;

const StyledTableBody = styled.tbody`
  tr:last-child {
    border-bottom: none;
  }
`;

const StyledTableFooter = styled.tfoot`
  border-top: 1px solid ${colors.border};
  background-color: rgba(0, 0, 0, 0.02);
  font-weight: 500;
`;

const StyledTableRow = styled.tr`
  border-bottom: 1px solid ${colors.border};
  transition: background-color 100ms;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  &[data-state="selected"] {
    background-color: ${colors.muted};
  }
`;

const StyledTableHead = styled.th`
  height: 40px;
  padding: 0 ${Theme.usage.space.medium};
  text-align: left;
  vertical-align: middle;
  font-weight: 500;
  color: ${colors.mutedForeground};
  white-space: nowrap;

  &:has([role="checkbox"]) {
    padding-right: 0;
  }
`;

const StyledTableCell = styled.td`
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  vertical-align: middle;

  &:has([role="checkbox"]) {
    padding-right: 0;
  }
`;

const StyledTableCaption = styled.caption`
  margin-top: ${Theme.usage.space.medium};
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  (props, ref) => (
    <TableWrapper>
      <StyledTable ref={ref} {...props} />
    </TableWrapper>
  )
);

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  (props, ref) => <StyledTableHeader ref={ref} {...props} />
);

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  (props, ref) => <StyledTableBody ref={ref} {...props} />
);

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  (props, ref) => <StyledTableFooter ref={ref} {...props} />
);

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  (props, ref) => <StyledTableRow ref={ref} {...props} />
);

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  (props, ref) => <StyledTableHead ref={ref} {...props} />
);

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  (props, ref) => <StyledTableCell ref={ref} {...props} />
);

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => <StyledTableCaption ref={ref} {...props} />
);

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableFooter.displayName = 'TableFooter';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';
TableCaption.displayName = 'TableCaption';
