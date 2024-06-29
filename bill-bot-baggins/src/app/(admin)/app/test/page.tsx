import React from 'react';

import Logo from '@/src/components/logo';
import Link from 'next/link';
import { Input } from '@/src/components/ui/input';
import {
  AreaChart,
  HelpCircle,
  LayoutDashboardIcon,
  Settings,
  User,
} from 'lucide-react';
import ReceiptText from '@/src/components/receipt';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs';
import DashboardOverview from '@/src/components/dashboard-overview';
import { DataTable } from '@/src/components';
import { UserNav } from '@/src/components/user-nav';
import { checkAuth } from '@/src/lib/server-utils';

export default async function Page() {
  const session = await checkAuth();

  return (
    <div className='flex min-h-screen w-full bg-neutral-800'>
      <section className='fixed left-0 flex h-screen w-[20%] flex-col bg-neutral-800 p-8'>
        <div className='flex flex-col gap-12 text-neutral-300'>
          <div className='flex flex-col gap-8 p-2'>
            <Logo size='small' className='-translate-y-3' />
            <Input type='text' placeholder='Search' />
          </div>
          <div className='flex flex-col gap-3'>
            <Link
              href='/app/invoice'
              className='flex cursor-pointer items-center gap-2 rounded-md p-4 transition-all hover:bg-neutral-700 hover:text-white'
            >
              <LayoutDashboardIcon />
              <p>Dashboard</p>
            </Link>
            <Link
              href='/app/invoice'
              className='flex cursor-pointer items-center gap-2 rounded-md p-4 transition-all hover:bg-neutral-700 hover:text-white'
            >
              <AreaChart />
              <p>Analytics</p>
            </Link>
            <Link
              href='#'
              className='flex cursor-pointer items-center gap-2 rounded-md p-4 transition-all hover:bg-neutral-700 hover:text-white'
            >
              <ReceiptText />
              <p>Invoices</p>
            </Link>
            <Link
              href='/app/invoice'
              className='flex cursor-pointer items-center gap-2 rounded-md p-4 transition-all hover:bg-neutral-700 hover:text-white'
            >
              <User />
              <p>Customers</p>
            </Link>
          </div>
        </div>

        <div className='mb-3 mt-auto flex flex-col'>
          <Link
            href='/app/invoice'
            className='flex cursor-pointer items-center gap-2 rounded-md p-4 transition-all hover:bg-neutral-700 hover:text-white'
          >
            <Settings />
            <p>Settings</p>
          </Link>
          <Link
            href='/app/invoice'
            className='flex cursor-pointer items-center gap-2 rounded-md p-4 transition-all hover:bg-neutral-700 hover:text-white'
          >
            <HelpCircle />
            <p>Help</p>
          </Link>
        </div>
      </section>

      <section className='ml-[20%] flex h-[70%] w-[80%] flex-col gap-4 rounded-lg'>
        <header className='fixed z-10 flex h-[5rem] w-[80%] items-center justify-between bg-neutral-800 px-10'>
          <h1 className='text-3xl font-semibold'>Dashboard</h1>
          <div className='flex items-center gap-3'>
            <UserNav />
            <div className='flex flex-col'>
              <h3 className='translate-y-1 text-[0.85rem] text-white/80'>
                Welcome back,
              </h3>
              <p className='text-[0.93rem] font-semibold'>
                {session.user.email}
              </p>
            </div>
          </div>
        </header>
        <main className='mb-5 mr-5 mt-[65px] overflow-auto bg-white/5 p-10'>
          <Tabs defaultValue='overview' className='space-y-4'>
            {/* <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
            </TabsList> */}
            <TabsContent value='overview' className='space-y-4'>
              <DashboardOverview />
              <DataTable />
            </TabsContent>
            <TabsContent value='analytics'></TabsContent>
          </Tabs>
        </main>
      </section>
    </div>
  );
}
