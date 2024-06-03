import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function RevenueCard({
  revenue,
  revenueGrowth,
}: {
  revenue: number;
  revenueGrowth: number;
}) {
  function getRevenueGrowthText(revenueGrowth: number) {
    return revenueGrowth > 0 ? `+${revenueGrowth}` : revenueGrowth;
  }
  return (
    <Card className='w-full md:w-1/3'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Revenue YTD</CardTitle>
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
          <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
        </svg>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{`${revenue.toLocaleString(
          'en-US',
          {
            style: 'currency',
            currency: 'USD',
          }
        )}`}</div>
        <p className='text-xs text-muted-foreground'>
          {`${getRevenueGrowthText(revenueGrowth)}% from last year`}
        </p>
      </CardContent>
    </Card>
  );
}
