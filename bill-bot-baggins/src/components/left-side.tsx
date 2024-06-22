import Logo from './logo';

export default function LeftSide() {
  return (
    <div className='relative flex h-full w-[55%] flex-col p-10 text-white'>
      {/* <ParticleEffect /> */}
      <div className='absolute inset-0 bg-[url("/forest.jpg")] bg-cover bg-center opacity-[0.45]' />

      <div className='z-10 flex items-center text-lg font-medium'>
        <Logo size='large' />
      </div>
      <div className='z-10 mt-auto'>
        <blockquote className='space-y-2'>
          <p className='text-white/80'>
            &ldquo;PayStream: Where your payments journey begins, and financial
            adventures never feel like a quest.&rdquo;
          </p>
          <footer className='text-sm'>Bobby Tables</footer>
        </blockquote>
      </div>
    </div>
  );
}
