import Link from 'next/link';
import AuthForm from './auth-form';

interface AdminAuthProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminAuth({ className, ...props }: AdminAuthProps) {
  return (
    <div className='flex flex-col gap-4 px-8'>
      <div className='flex w-full flex-col space-y-2'>
        <h1 className='text-2xl font-semibold tracking-tight'>Admin Login</h1>
        <p className='text-sm text-muted-foreground'>
          Enter your credentials below to sign in
        </p>
      </div>
      <AuthForm type='login' />
      <Link
        className='text-sm text-muted-foreground hover:text-primary'
        href={'#'}
      >
        Forgot password?
      </Link>
    </div>
  );
}
