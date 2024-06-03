import React from 'react';
import { UserButton, auth } from '@clerk/nextjs';
import Logo from './logo';

export default function Navbar() {
  const user = auth();

  return (
    <header className='flex h-[64px] w-full items-center justify-between border-b border-neutral-800 bg-neutral-900 px-5 py-4 lg:px-36'>
      <Logo size='small' />
      {user ? <UserButton /> : null}
    </header>
  );
}
