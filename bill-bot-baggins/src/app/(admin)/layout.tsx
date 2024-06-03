import { getSalesForceInvoiceData } from '@/src/actions/actions';
import Navbar from '@/src/components/Navbar';
import RevenueContextProvider from '@/src/contexts/revenue-context-provider';

export default async function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  // get SF invoice data using accessToken
  const invoiceData = await getSalesForceInvoiceData();

  return (
    <RevenueContextProvider invoiceData={invoiceData}>
      <section className='h-screen bg-neutral-950'>
        <Navbar />
        {children}
      </section>
    </RevenueContextProvider>
  );
}
