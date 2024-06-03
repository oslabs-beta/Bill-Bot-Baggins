'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PaymentProps } from '@/src/lib/types';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<PaymentProps>[] = [
  {
    accessorKey: 'invoice_id',
    header: ({ column }) => {
      return (
        <div
          className='flex cursor-pointer select-none hover:text-white'
          onClick={() => column.toggleSorting()}
        >
          Invoice ID
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-2 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-2 h-4 w-4' />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'account_name',
    header: ({ column }) => {
      return (
        <div
          className='flex cursor-pointer select-none hover:text-white'
          onClick={() => column.toggleSorting()}
        >
          Client
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-2 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-2 h-4 w-4' />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'project_name',
    header: ({ column }) => {
      return (
        <div
          className='flex cursor-pointer select-none hover:text-white'
          onClick={() => column.toggleSorting()}
        >
          Project
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-2 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-2 h-4 w-4' />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <div
          className='flex cursor-pointer select-none hover:text-white'
          onClick={() => column.toggleSorting()}
        >
          Amount
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-2 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-2 h-4 w-4' />
          )}
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className='font-medium'>{formatted}</div>;
    },
  },
  {
    accessorKey: 'invoice_sent_date',
    header: ({ column }) => {
      return (
        <div
          className='flex cursor-pointer select-none hover:text-white'
          onClick={() => column.toggleSorting()}
        >
          Invoice Sent Date
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-2 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-2 h-4 w-4' />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'invoice_due_date',
    header: ({ column }) => {
      return (
        <div
          className='flex cursor-pointer select-none hover:text-white'
          onClick={() => column.toggleSorting()}
        >
          Invoice Due Date
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-2 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-2 h-4 w-4' />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'payment_date',
    header: ({ column }) => {
      return (
        <div
          className='flex cursor-pointer select-none hover:text-white'
          onClick={() => column.toggleSorting()}
        >
          Payment Date
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-2 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-2 h-4 w-4' />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'payment_method',
    header: 'Payment Method',
  },
];
