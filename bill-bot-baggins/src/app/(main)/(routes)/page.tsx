import Link from 'next/link';
import React from 'react';
import TeamMember from '@/src/components/team-member';
import Logo from '@/src/components/logo';

export default function Page() {
  return (
    <div className='relative grid h-full justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='absolute inset-0 bg-[url("/ales-nesetril-background.png")] bg-cover bg-left' />
      <div className='container relative flex h-full max-w-2xl flex-col'>
        <Logo size='large' className='mt-5' />
        <div className='text-slate-25 pt-10 text-4xl sm:text-6xl'>
          <p>Real-time updates,</p>
          <p>Well-informed decisions</p>
        </div>
        <div>
          <p className='mb-5 mt-6 text-xl sm:text-2xl'>
            PayStream provides real-time payment information so you can make
            well-informed business decisions based on your cash-flow metrics.
          </p>
          <div className=''>
            <footer className=''>
              <div>
                <p className='text-normal italic sm:text-lg'>
                  PayStream is an Open Source product developed in collaboration
                  with OS Labs.
                </p>
                <div className='flex items-center gap-2 pt-4'>
                  <Link
                    className='rounded-full bg-green-200 px-4 py-2 font-semibold text-neutral-900 transition-all hover:border-green-200 hover:bg-green-200/80 hover:text-neutral-900/90'
                    href='/app/dashboard'
                  >
                    Experience PayStream
                  </Link>

                  <Link
                    className='sm:text-md rounded-full border-2 border-green-200 bg-transparent px-4 py-2 text-sm text-green-200 transition-all hover:bg-green-200/90 hover:text-black'
                    href='https://github.com/oslabs-beta/PayStream'
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </footer>
          </div>
          <div className='absolute bottom-10'>
            <h1 className='pb-4 text-xl tracking-tight sm:text-3xl'>
              Meet the <span className='pl-2 font-bold'>T e a m</span>
            </h1>
            <footer className='flex gap-4'>
              <TeamMember
                href={'https://github.com/lcchrty'}
                email={'chndlrchrty@gmail.com'}
                firstName='Chandler'
                lastName='Charity'
              />
              <TeamMember
                href={'https://github.com/juliazlx'}
                email={'julia.zl.xin@gmail.com'}
                firstName='Julia'
                lastName='Xin'
              />
              <TeamMember
                href={'https://github.com/lhodges3'}
                email={'lhodges3@binghamton.edu'}
                firstName='Liam'
                lastName='Hodges'
              />
              <TeamMember
                href={'https://github.com/Gambarou'}
                email={'peelintaters85@gmail.com'}
                firstName='Robert'
                lastName='Hoover'
              />
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
