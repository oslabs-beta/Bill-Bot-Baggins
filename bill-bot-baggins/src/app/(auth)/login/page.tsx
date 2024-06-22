import { AdminAuth } from '@/src/components/admin-auth';
import LeftSide from '@/src/components/left-side';

export default function Page() {
  return (
    <>
      <div className='flex h-full w-full items-center justify-center'>
        <LeftSide />
        <div className='flex h-full w-[45%] flex-col items-center justify-center border-l border-neutral-800 bg-neutral-900 lg:p-8'>
          <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-col items-center gap-1'>
              <h1 className='text-4xl font-bold text-foreground'>
                Welcome back!
              </h1>
              <p className='w-[18rem] text-center text-sm text-muted-foreground'>
                Enter your login credentials below to sign in to the admin
                dashboard
              </p>
            </div>
            <div className='flex h-[400px] w-[350px] flex-col justify-evenly rounded-lg border border-neutral-700 bg-neutral-800'>
              <AdminAuth />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
