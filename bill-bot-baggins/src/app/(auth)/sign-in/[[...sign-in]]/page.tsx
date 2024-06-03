import { AdminAuth } from '@/src/components/AdminAuth';
import LeftSide from '@/src/components/left-side';
import React from 'react';

export default function Page() {
  return (
    <div className='container relative h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <LeftSide />
      <div className='z-20 flex h-full items-center justify-center bg-neutral-900 lg:p-8'>
        <div className='mx-auto flex w-full flex-col space-y-6 rounded-lg border border-neutral-700 bg-neutral-800 p-12 sm:w-[400px]'>
          <div className='flex flex-col space-y-2'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Admin Login
            </h1>
            <p className='text-sm text-muted-foreground'>
              Enter your credentials below to sign in
            </p>
          </div>
          <AdminAuth />
        </div>
      </div>
    </div>
  );
}
