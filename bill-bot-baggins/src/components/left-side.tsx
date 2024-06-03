import Link from 'next/link';
import ParticleEffect from './ParticleEffect';
import Logo from './logo';

export default function LeftSide() {
  return (
    <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
      <div className='absolute inset-0 bg-black opacity-80' />
      <ParticleEffect />
      <div className='relative z-20 flex items-center text-lg font-medium'>
        <Logo size='large' />
      </div>
      <div className='relative z-20 mt-auto'>
        <blockquote className='space-y-2'>
          <p className='text-lg'>
            &ldquo;PayStream: Where your payments journey begins, and financial
            adventures never feel like a quest.&rdquo;
          </p>
          <footer className='text-sm'>Bobby Tables</footer>
        </blockquote>
      </div>
    </div>
  );
}
