import { AdminAuth } from '@/src/components/admin-auth';
import LeftSide from '@/src/components/left-side';

export default function Page() {
  return (
    <>
      <div className='flex h-full w-full items-center justify-center'>
        <LeftSide />
        <div className='flex h-full w-[45%] flex-col items-center justify-center border-l border-neutral-800 bg-neutral-900 lg:p-8'>
          <h1 className='text-5xl font-bold text-white/70'>Welcome back!</h1>
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
    </>
  );
}
