import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  getRowKey: (row: T) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  className?: string;
}

function Table<T>({
  data,
  columns,
  getRowKey,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  selectable = false,
  onSelectionChange,
  className = '',
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortDirection === 'asc' 
          ? (aValue === bValue ? 0 : aValue ? -1 : 1)
          : (aValue === bValue ? 0 : aValue ? 1 : -1);
      }

      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleRowSelection = (row: T, checked: boolean) => {
    const newSelectedRows = checked
      ? [...selectedRows, row]
      : selectedRows.filter(r => getRowKey(r) !== getRowKey(row));
    
    setSelectedRows(newSelectedRows);
    onSelectionChange?.(newSelectedRows);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelectedRows = checked ? [...data] : [];
    setSelectedRows(newSelectedRows);
    onSelectionChange?.(newSelectedRows);
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  const renderSortIcon = (column: keyof T) => {
    if (sortColumn !== column) {
      return <ChevronUp size={16} className="text-gray-400 opacity-50" />;
    }
    
    return sortDirection === 'asc' ? (
      <ChevronUp size={16} className="text-primary-gold" />
    ) : (
      <ChevronDown size={16} className="text-primary-gold" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-gold border-t-transparent" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {selectable && (
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key as string}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300' : ''
                }`}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && renderSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedData.map((row, rowIndex) => (
            <tr
              key={getRowKey(row)}
              className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {selectable && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRows.some(r => getRowKey(r) === getRowKey(row))}
                    onChange={(e) => handleRowSelection(row, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={column.key as string}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
