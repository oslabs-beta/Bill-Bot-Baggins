import { Footer, Navbar } from '@/src/components/index';

export default function ClientLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='flex h-screen flex-col bg-[url("/bg-pattern.jpeg")]'>
      <Navbar />
      {children}
      <Footer />
    </section>
  );
}
