import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function OutstandingInvoicesCard({
  outstandingInvoices,
}: {
  outstandingInvoices: number;
}) {
  return (
    <Card className='w-full md:w-1/3'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>
          # of Outstanding Invoices
        </CardTitle>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-muted-foreground'
        >
          <rect width='20' height='14' x='2' y='5' rx='2' />
          <path d='M2 10h20' />
        </svg>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{`${outstandingInvoices}`}</div>
      </CardContent>
    </Card>
  );
}
