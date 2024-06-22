import { PaymentProps } from '@/src/lib/types';

export default function RecentSales({
  payments,
}: {
  payments: PaymentProps[];
}) {
  return (
    <div className='space-y-8'>
      {payments.map((payment) => (
        <div key={payment.invoice_id} className='flex items-center p-1'>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {payment.account_name}
            </p>
            <p className='text-sm text-muted-foreground'>
              ESC-{payment.invoice_id}
            </p>
          </div>
          <div className='ml-auto font-medium text-green-500'>
            +
            {payment.amount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
