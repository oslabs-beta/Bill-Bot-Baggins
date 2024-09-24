import MonthlyRevenueChart from './monthly-revenue-chart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type RevenueOverviewCardProps = {
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
};
export default function RevenueOverviewCard({
  revenueByMonth,
}: RevenueOverviewCardProps) {
  const currentYear = new Date().getFullYear().toString();

  return (
    <Card className='w-full md:w-[60%]'>
      <CardHeader>
        <CardTitle>{`Overview of ${currentYear}`}</CardTitle>
      </CardHeader>
      <CardContent className='pl-2'>
        <MonthlyRevenueChart revenueByMonth={revenueByMonth} />
      </CardContent>
    </Card>
  );
}
