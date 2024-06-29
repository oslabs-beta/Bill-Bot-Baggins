'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';

import type {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-md bg-neutral-600 p-2 text-orange-400'>
        <p className='font-bold'>{`Revenue`}</p>
        <p className=''>{`${label}: ${payload[0].value?.toLocaleString(
          'en-US',
          {
            style: 'currency',
            currency: 'USD',
          }
        )}`}</p>
      </div>
    );
  }

  return null;
};

type MonthlyRevenueChartProps = {
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
};

export default function MonthlyRevenueChart({
  revenueByMonth,
}: MonthlyRevenueChartProps) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={revenueByMonth}>
        <XAxis
          dataKey='month'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <defs>
          <linearGradient id='gradient' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='5%' stopColor='#818cf8' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#6366f1' stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <Bar dataKey='revenue' fill='url(#gradient)' radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
