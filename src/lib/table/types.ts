// Table library types this should do for now

export type StatusType = 'not-set' | 'in-process' | 'need-to-start' | 'complete' | 'blocked';

export interface CellData {
  id: string;
  value: unknown;
  type?: 'text' | 'number' | 'date' | 'url' | 'status' | 'custom';
  textAlign?: 'left' | 'center' | 'right';
  format?: string;
  style?: {
    color?: string;
    fontWeight?: string;
    backgroundColor?: string;
  };
  isEditing?: boolean;
  customRenderer?: (props: { value: unknown, rowId: string, colId: string }) => React.ReactNode;
}

export interface ColumnDef {
  id: string;
  title: string;
  accessorKey?: string;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'url' | 'status' | 'custom';
  headerIcon?: string;
  headerStyle?: React.CSSProperties;
  headerColor?: string;
  cellStyle?: React.CSSProperties;
  headerClass?: string;
  cellClass?: string;
  textAlign?: 'left' | 'center' | 'right';
  cellRenderer?: (props: { value: unknown, rowId: string, colId: string }) => React.ReactNode;
  headerRenderer?: (props: { column: ColumnDef }) => React.ReactNode;
  isResizable?: boolean;
  isSortable?: boolean;
  isEditable?: boolean;
}

export interface RowData {
  id: string;
  cells?: Record<string, CellData>;
  [key: string]: unknown; // For dynamic properties
  height?: number;
  isHidden?: boolean;
}

export interface TableState {
  columns: ColumnDef[];
  data: RowData[];
  activeCell: { rowId: string; colId: string } | null;
  selectedCells: { rowId: string; colId: string }[];
  editingCell: { rowId: string; colId: string } | null;
}

export interface TableProps {
  columns: ColumnDef[];
  data: RowData[];
  onCellChange?: (rowId: string, colId: string, value: unknown) => void;
  onColumnTitleChange?: (columnId: string, title: string) => void;
  onColumnTypeChange?: (columnId: string, type: 'text' | 'number' | 'date' | 'url' | 'custom') => void;
  onHeaderColorChange?: (columnId: string, color: string) => void;
  onColumnResize?: (columnId: string, width: string) => void;
  onRowAdd?: () => void;
  onColumnAdd?: () => void;
  showRowNumbers?: boolean;
  enableEditing?: boolean;
  enableSelection?: boolean;
  enableSorting?: boolean;
  enableResizing?: boolean;
  enableFiltering?: boolean;
  className?: string;
  style?: React.CSSProperties;
  headerClassName?: string;
  cellClassName?: string;
  rowClassName?: string;
}

export interface TableContextType {
  state: TableState;
  setCellValue: (rowId: string, colId: string, value: unknown) => void;
  addColumn: () => void;
  addRow: () => void;
  setActiveCell: (rowId: string, colId: string) => void;
  startEditingCell: (rowId: string, colId: string) => void;
  stopEditingCell: () => void;
  getColumnLetter: (index: number) => string;
}
