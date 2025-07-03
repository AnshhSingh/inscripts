import { ColumnDef, RowData } from './types';

export const defaultColumns: ColumnDef[] = [
  { id: 'col-1', title: 'Job Request', width: 'min-w-80 w-80', type: 'text' },
  { id: 'col-2', title: 'Submitted', width: 'min-w-40 w-40', type: 'date' },
  { id: 'col-3', title: 'Status', width: 'min-w-40 w-40', type: 'text' },
  { id: 'col-4', title: 'Submitter', width: 'min-w-40 w-40', type: 'text' },
  { id: 'col-5', title: 'URL', width: 'min-w-56 w-56', type: 'url' },
  { id: 'col-6', title: 'Assigned', width: 'min-w-40 w-40', type: 'text', headerColor: '#E8F0E9' },
  { id: 'col-7', title: 'Priority', width: 'min-w-40 w-40', type: 'text', headerColor: '#EAE3FC' },
  { id: 'col-8', title: 'Due Date', width: 'min-w-40 w-40', type: 'date', headerColor: '#EAE3FC' },
  { id: 'col-9', title: 'Est. Value', width: 'min-w-40 w-40', type: 'number', headerColor: '#FFE9E0' },
];

// Helper function to create empty rows
const createEmptyRow = (index: number): RowData => ({
  id: `row-${index}`,
  cells: Object.fromEntries(
    defaultColumns.map(col => [
      col.id,
      { id: `cell-${index}-${col.id.split('-')[1]}`, value: '' }
    ])
  )
});

// Combine filled rows with empty rows to make 25 total
export const defaultRows: RowData[] = [
  {
    id: 'row-1',
    cells: {
      'col-1': { id: 'cell-1-1', value: 'Launch social media campaign for product XYZ' },
      'col-2': { id: 'cell-1-2', value: '2024-12-11', type: 'date' },
      'col-3': { id: 'cell-1-3', value: 'In-process' },
      'col-4': { id: 'cell-1-4', value: 'Aisha Patel' },
      'col-5': { id: 'cell-1-5', value: 'https://www.aishapatel.com', type: 'url' },
      'col-6': { id: 'cell-1-6', value: 'Sophie Choudhury' },
      'col-7': { id: 'cell-1-7', value: 'Medium' },
      'col-8': { id: 'cell-1-8', value: '2024-11-20', type: 'date' },
      'col-9': { id: 'cell-1-9', value: 6200000, type: 'number' },
    }
  },
  {
    id: 'row-2',
    cells: {
      'col-1': { id: 'cell-2-1', value: 'Update press kit for company redesign' },
      'col-2': { id: 'cell-2-2', value: '2024-02-08', type: 'date' },
      'col-3': { id: 'cell-2-3', value: 'Need to start' },
      'col-4': { id: 'cell-2-4', value: 'Irfan Khan' },
      'col-5': { id: 'cell-2-5', value: 'https://www.irfankhanportfolio.com', type: 'url' },
      'col-6': { id: 'cell-2-6', value: 'Tejas Pandey' },
      'col-7': { id: 'cell-2-7', value: 'High' },
      'col-8': { id: 'cell-2-8', value: '2024-10-30', type: 'date' },
      'col-9': { id: 'cell-2-9', value: 3500000, type: 'number' },
    }
  },
  {
    id: 'row-3',
    cells: {
      'col-1': { id: 'cell-3-1', value: 'Finalize user testing feedback for app update' },
      'col-2': { id: 'cell-3-2', value: '2024-05-12', type: 'date' },
      'col-3': { id: 'cell-3-3', value: 'In-process' },
      'col-4': { id: 'cell-3-4', value: 'Mark Johnson' },
      'col-5': { id: 'cell-3-5', value: 'https://www.markjohnsondesigns.com', type: 'url' },
      'col-6': { id: 'cell-3-6', value: 'Rachel Lee' },
      'col-7': { id: 'cell-3-7', value: 'Medium' },
      'col-8': { id: 'cell-3-8', value: '2024-12-10', type: 'date' },
      'col-9': { id: 'cell-3-9', value: 47500000, type: 'number' },
    }
  },
  {
    id: 'row-4',
    cells: {
      'col-1': { id: 'cell-4-1', value: 'Design new features for the website' },
      'col-2': { id: 'cell-4-2', value: '2025-10-01', type: 'date' },
      'col-3': { id: 'cell-4-3', value: 'Complete' },
      'col-4': { id: 'cell-4-4', value: 'Emily Green' },
      'col-5': { id: 'cell-4-5', value: 'https://www.emilygreenart.com', type: 'url' },
      'col-6': { id: 'cell-4-6', value: 'Tom Wright' },
      'col-7': { id: 'cell-4-7', value: 'Low' },
      'col-8': { id: 'cell-4-8', value: '2025-01-15', type: 'date' },
      'col-9': { id: 'cell-4-9', value: 5900000, type: 'number' },
    }
  },
  {
    id: 'row-5',
    cells: {
      'col-1': { id: 'cell-5-1', value: 'Prepare financial report for Q4' },
      'col-2': { id: 'cell-5-2', value: '2025-01-25', type: 'date' },
      'col-3': { id: 'cell-5-3', value: 'Blocked' },
      'col-4': { id: 'cell-5-4', value: 'Jessica Brown' },
      'col-5': { id: 'cell-5-5', value: 'https://www.jessicabrowncreative.com', type: 'url' },
      'col-6': { id: 'cell-5-6', value: 'Kevin Smith' },
      'col-7': { id: 'cell-5-7', value: 'Low' },
      'col-8': { id: 'cell-5-8', value: '2025-01-30', type: 'date' },
      'col-9': { id: 'cell-5-9', value: 2800000, type: 'number' },
    }
  },
  // Add 20 more empty rows to make 25 total
  ...Array.from({ length: 20 }, (_, i) => createEmptyRow(i + 6))
];
