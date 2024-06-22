import React from 'react';
import { cn } from '@/src/lib/utils';

type InvoiceSectionProps = {
  title: string;
  invoiceData: string | number | null;
  variant?: boolean;
};

function InvoiceSection({ title, invoiceData, variant }: InvoiceSectionProps) {
  return (
    <div className={cn('space-y-2', variant && 'flex flex-col items-center')}>
      <h3 className='text-xs text-neutral-400'>{title}</h3>
      <p className='font-bold text-white/80'>{invoiceData}</p>
    </div>
  );
}

export default InvoiceSection;
