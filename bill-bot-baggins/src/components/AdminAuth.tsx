'use client';

import AuthForm from './auth-form';

interface AdminAuthProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminAuth({ className, ...props }: AdminAuthProps) {
  return (
    <div className='flex flex-col space-y-4'>
      <AuthForm />
    </div>
  );
}
