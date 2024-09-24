import Logo from './logo';
import { UserNav } from './user-nav';

export default async function Navbar() {
  return (
    <header className='flex h-[64px] w-full items-center justify-between border-b border-neutral-600 bg-neutral-800 px-5 py-4 lg:px-36'>
      <Logo size='small' />
      <UserNav />
    </header>
  );
}
