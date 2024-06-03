import { PaymentProps } from '../lib/types';
import RecentSales from './RecentSales';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

type RecentPaymentsCardProps = {
  recentPayments: PaymentProps[];
};

export default function RecentPaymentsCard({
  recentPayments,
}: RecentPaymentsCardProps) {
  return (
    <Card className='w-full md:w-[40%]'>
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
        <CardDescription>
          There have been {recentPayments.length} recent payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RecentSales payments={recentPayments} />
      </CardContent>
    </Card>
  );
}
