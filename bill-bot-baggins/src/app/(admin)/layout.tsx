import { getSalesForceInvoiceData } from '@/src/actions/actions';
import { Footer } from '@/src/components';
import RevenueContextProvider from '@/src/contexts/revenue-context-provider';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // get SF invoice data using accessToken
  const invoiceData = await getSalesForceInvoiceData();

  return (
    <RevenueContextProvider invoiceData={invoiceData}>
      {/* <section className='flex min-h-screen flex-col bg-[url("/bg-pattern.jpeg")]'> */}
      {children}
      {/* <Footer />
      </section> */}
    </RevenueContextProvider>
  );
}
