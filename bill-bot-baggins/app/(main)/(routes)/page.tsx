import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import TeamMember from '@/components/TeamMember';

function Home() {
  return (
    <div className='relative grid h-full justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='absolute inset-0 bg-[url("/ales-nesetril-background.jpg")] bg-cover bg-left' />
      <div className='container relative flex h-full max-w-2xl flex-col gap-3'>
        <div className='relative z-20 flex items-center pt-10 text-lg font-medium'>
          <Link className='-translate-x-4' href='/'>
            <Image
              src='/logo.png'
              alt='PayStream logo'
              width={400}
              height={40}
              priority={true}
              className='relative flex justify-center'
            />
          </Link>
        </div>
        <div className='text-slate-25 pt-10 text-3xl sm:text-6xl'>
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
                <div className='flex flex-col gap-3 pt-4 sm:flex-row'>
                  <Link
                    className='text-md flex items-center justify-center rounded-full bg-green-200 px-4 py-2 font-bold text-black transition-all hover:bg-green-200/90 active:scale-95 sm:text-lg'
                    href='/admin'
                  >
                    Experience PayStream
                  </Link>
                  <Link
                    className='sm:text-md flex items-center justify-center rounded-full border-2 border-green-200 px-4 py-2 text-sm text-green-200 transition-all hover:bg-green-200/90 hover:text-black active:scale-95'
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
              Meet the <span className='font-bold tracking-widest'>Team</span>
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
export default Home;
