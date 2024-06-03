import Stripe from 'stripe';
import InvoiceSection from '@/src/components/InvoiceSection';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

type InvoiceDisplayProps = {
  invoice: Stripe.Invoice;
};

export default function InvoiceDisplay({ invoice }: InvoiceDisplayProps) {
  const invoiceDate = formatDate(invoice.created);
  const dueDate = formatDate(invoice.due_date);

  const statusStyles = {
    open: 'bg-amber-500/20 text-amber-300',
    paid: 'bg-green-500/20 text-green-300',
    draft: 'bg-blue-500/20 text-blue-300',
    uncollectible: 'bg-rose-500/20 text-rose-300',
    void: 'bg-gray-900/20 text-gray-300',
    default: 'bg-rose-500/20 text-rose-300',
  };

  return (
    <div className='flex h-full w-full flex-col items-center justify-center'>
      <InvoiceHeader
        invoice={invoice}
        badgeStyle={
          invoice.status ? statusStyles[invoice.status] : statusStyles.default
        }
      />
      <Card className='w-full max-w-[900px] border border-neutral-700 bg-neutral-800'>
        <CardHeader className='flex flex-row justify-between'>
          <CardTitle>
            #<span className='font-bold text-white/90'>{invoice.number}</span>
          </CardTitle>
          <CardDescription className='flex flex-col font-bold text-white/80'>
            <span className='flex flex-col font-bold'>
              Executive Service Corps{' '}
              <span className='text-xs font-normal text-neutral-400'>
                1000 Alameda St
              </span>
              <span className='text-xs font-normal text-neutral-400'>
                Los Angeles, CA 90012
              </span>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col justify-between gap-3'>
          <Card className='w-full border border-neutral-700 bg-neutral-800/80 pt-10 text-white/80'>
            <CardContent className='flex w-full justify-between'>
              <div className='flex flex-col space-y-8'>
                <InvoiceSection
                  title='Invoice Date'
                  invoiceData={invoiceDate!}
                />
                <InvoiceSection title='Payment Due' invoiceData={dueDate!} />
              </div>
              <div className='flex flex-col'>
                <InvoiceSection
                  title='Bill to'
                  invoiceData={invoice.customer_name}
                />
                {invoice.customer_address && (
                  <div className='text-xs'>
                    <span>{invoice.customer_address.line1}</span>
                    <span>{invoice.customer_address.line2}</span>
                    <span>
                      {invoice.customer_address.city},{' '}
                      <span>{invoice.customer_address.state}</span>{' '}
                      <span>{invoice.customer_address.postal_code}</span>
                    </span>
                  </div>
                )}
              </div>
              <InvoiceSection
                title='Sent to'
                invoiceData={invoice.customer_email}
              />
            </CardContent>
          </Card>
          <Card className='border border-neutral-700 bg-neutral-800/80 text-white/80'>
            <CardContent>
              <div className='flex justify-between rounded-md p-10'>
                <div className='flex'>
                  <InvoiceSection
                    title='Item Name'
                    invoiceData={invoice.lines.data[0].description}
                  />
                </div>
                <div className='flex justify-between space-x-12'>
                  <InvoiceSection
                    title='QTY'
                    invoiceData={invoice.lines.data[0].quantity}
                    variant={true}
                  />
                  <InvoiceSection
                    title='Price'
                    invoiceData={(
                      (invoice.lines.data[0].price?.unit_amount as number) / 100
                    ).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                    variant={true}
                  />
                  <InvoiceSection
                    title='Total'
                    invoiceData={(
                      (invoice.amount_remaining as number) / 100
                    ).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                    variant={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter>
          <div className='flex w-full space-x-4'>
            {invoice.status === 'open' ? (
              <Button className='rounded-full bg-indigo-500/80 transition-all hover:scale-105 hover:bg-indigo-500 active:scale-100'>
                <a href={invoice.hosted_invoice_url as string}>Pay Invoice</a>
              </Button>
            ) : (
              <Button className='rounded-full bg-neutral-700' disabled={true}>
                Pay Invoice
              </Button>
            )}
            <Button
              variant='outline'
              className='hover:text-inidigo-400 rounded-full border border-indigo-500 bg-transparent text-indigo-400 transition-all hover:scale-105 hover:bg-neutral-900/20 active:scale-100'
            >
              <a href={invoice.invoice_pdf as string}>Download Invoice</a>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

const formatDate = (timeStamp: number | null) => {
  if (timeStamp === null) return '';

  const date = new Date(timeStamp * 1000);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const InvoiceHeader = ({
  invoice,
  badgeStyle,
}: {
  invoice: Stripe.Invoice;
  badgeStyle: string;
}) => (
  <h1 className='flex w-full max-w-[900px] items-center gap-3 pb-4 text-2xl font-bold'>
    Invoice
    <Badge variant='outline' className={badgeStyle}>
      {invoice.status}
    </Badge>
  </h1>
);
