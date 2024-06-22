'use client';

import { createContext } from 'react';
import { PaymentProps } from '../lib/types';

type TRevenueContext = {
  revenueData: {
    revenueByMonth: {
      month: string;
      revenue: number;
    }[];
    revenueYTD: number;
    revenueMTD: number;
    yearRevenueGrowth: number;
    monthRevenueGrowth: number;
    outstandingInvoices: number;
  };
  invoiceData: PaymentProps[];
};

export const RevenueContext = createContext<TRevenueContext | null>(null);

export default function RevenueContextProvider({
  invoiceData,
  children,
}: {
  invoiceData: PaymentProps[];
  children: React.ReactNode;
}) {
  const revenueByMonth = [
    { month: 'Jan', revenue: 0 },
    { month: 'Feb', revenue: 0 },
    { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 0 },
    { month: 'May', revenue: 0 },
    { month: 'Jun', revenue: 0 },
    { month: 'Jul', revenue: 0 },
    { month: 'Aug', revenue: 0 },
    { month: 'Sep', revenue: 0 },
    { month: 'Oct', revenue: 0 },
    { month: 'Nov', revenue: 0 },
    { month: 'Dec', revenue: 0 },
  ];
  let revenueYTD = 0,
    lastYearRevenue = 0,
    lastMonthRevenue = 0,
    revenueMTD = 0,
    yearRevenueGrowth = 0,
    monthRevenueGrowth = 0,
    outstandingInvoices = 0;

  // loop through the resulting data from salesforce and add the revenue data to the specific month
  invoiceData.forEach((invoice) => {
    const { payment_date, amount } = invoice;
    const [currentYear, currentMonth] = new Date()
      .toISOString()
      .slice(0, 10)
      .split('-');

    if (payment_date) {
      const month = Number(payment_date.slice(5, 7));
      const year = Number(payment_date.slice(0, 4));

      if (year === parseInt(currentYear) - 1) {
        revenueByMonth[month - 1].revenue += amount;

        revenueYTD += amount;

        if (month === parseInt(currentMonth)) {
          revenueMTD += amount;
        }

        if (month === parseInt(currentMonth) - 1) {
          lastMonthRevenue += amount;
        }
      }

      if (year === parseInt(currentYear) - 2) {
        lastYearRevenue += amount;
      }
    } else {
      outstandingInvoices++;
    }
  });

  const invoiceDataCopy = [...invoiceData];

  invoiceDataCopy.sort((a, b) => {
    const dateA = a.payment_date ? new Date(a.payment_date).getTime() : 0;
    const dateB = b.payment_date ? new Date(b.payment_date).getTime() : 0;

    return dateB - dateA;
  });

  yearRevenueGrowth = calculatePercentChange(revenueYTD, lastYearRevenue);
  monthRevenueGrowth = calculatePercentChange(revenueMTD, lastMonthRevenue);
  return (
    <RevenueContext.Provider
      value={{
        revenueData: {
          revenueByMonth,
          revenueMTD,
          revenueYTD,
          yearRevenueGrowth,
          monthRevenueGrowth,
          outstandingInvoices,
        },
        invoiceData: invoiceDataCopy,
      }}
    >
      {children}
    </RevenueContext.Provider>
  );
}

function calculatePercentChange(currentRevenue: number, pastRevenue: number) {
  if (pastRevenue === 0) {
    return currentRevenue > 0 ? 100 : 0;
  }
  let percentChange = ((currentRevenue - pastRevenue) / pastRevenue) * 100;
  return percentChange;
}
