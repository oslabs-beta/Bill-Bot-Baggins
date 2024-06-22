import InvoiceDisplay from '@/src/components/invoice-display';
import { InvoiceId } from '@/src/lib/types';
import { getStripeInvoiceData } from '@/src/actions/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default async function Page({ params }: { params: InvoiceId }) {
  const { invoiceId } = params;

  const data = await getStripeInvoiceData(invoiceId);

  if (!data) {
    return (
      <div className='absolute top-0 flex h-full w-full items-center justify-center bg-neutral-950/60 backdrop-blur-sm'>
        <Card className='bg-neutral-900'>
          <CardContent>
            <CardHeader>
              <CardTitle className='flex items-center gap-1 text-lg text-red-500'>
                <AlertCircle className='h-4 w-4' />
                Error
              </CardTitle>
              <CardDescription>
                Invalid payment link. Please check the link and try again.
              </CardDescription>
            </CardHeader>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <section className='flex h-full w-full flex-col items-center justify-center'>
      <InvoiceDisplay invoice={data} />
    </section>
  );
}
