'use client';

import { useRevenueContext } from '../lib/hooks';
import RevenueCard from './revenue-card';
import OutstandingInvoicesCard from './outstanding-invoices-card';
import RevenueOverviewCard from './revenue-overview-card';
import RecentPaymentsCard from './recent-payments-card';

export default function DashboardOverview() {
  const {
    revenueData: {
      revenueByMonth,
      revenueMTD,
      revenueYTD,
      yearRevenueGrowth,
      monthRevenueGrowth,
      outstandingInvoices,
    },
    invoiceData,
  } = useRevenueContext();

  const recentPayments = invoiceData.slice(0, 5);

  return (
    <>
      <div className='flex flex-col gap-3 md:flex-row'>
        <RevenueCard
          type='year'
          revenue={revenueYTD}
          revenueGrowth={yearRevenueGrowth}
        />
        <RevenueCard
          type='month'
          revenue={revenueMTD}
          revenueGrowth={monthRevenueGrowth}
        />
        <OutstandingInvoicesCard outstandingInvoices={outstandingInvoices} />
      </div>
      <div className='flex flex-col gap-4 md:flex-row'>
        <RevenueOverviewCard revenueByMonth={revenueByMonth} />
        <RecentPaymentsCard recentPayments={recentPayments} />
      </div>
    </>
  );
}
