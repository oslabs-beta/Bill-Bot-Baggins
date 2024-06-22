'use client';

import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { useMemo, useState } from 'react';
import { columns } from '@/src/components';
import { useRevenueContext } from '../lib/hooks';

export default function DataTable() {
  const { invoiceData: data } = useRevenueContext();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data,
    columns,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  // Function to safely extract filter value
  const safeFilterValue = (columnKey: string): string => {
    const value = table.getColumn(columnKey)?.getFilterValue();
    return typeof value === 'string' ? value : '';
  };

  return (
    <main className='border border-neutral-700 bg-card p-2'>
      <div className='flex items-center space-x-4'>
        <div className='flex items-center'>
          <Input
            placeholder='Filter by Invoice ID'
            value={safeFilterValue('invoice_id')}
            onChange={(event) =>
              table.getColumn('invoice_id')?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
        </div>

        <div className='flex items-center py-4'>
          <Input
            placeholder='Filter by Client'
            value={safeFilterValue('account_name')}
            onChange={(event) =>
              table
                .getColumn('account_name')
                ?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
        </div>

        <Button
          disabled={!columnFilters.length}
          className='transition-all active:scale-95'
          size={'sm'}
          onClick={() => setColumnFilters([])}
        >
          Clear
        </Button>
      </div>
      <div className='rounded-md border'>
        <Table className='bg-card'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <span className='flex items-center gap-1 text-sm'>
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </main>
  );
}
