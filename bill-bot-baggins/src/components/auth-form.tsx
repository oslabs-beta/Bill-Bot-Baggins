'use client';

import { Input } from '@/src/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema } from '../lib/validations/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { AlertTriangle } from 'lucide-react';
import { Label } from './ui/label';
import { useFormState } from 'react-dom';
import { logIn, signUp } from '../actions/actions';
import AuthFormButton from './auth-form-button';

type AuthFormProps = {
  type: 'signup' | 'login';
};

export default function AuthForm({ type }: AuthFormProps) {
  const [signUpError, dispatchSignUp] = useFormState(signUp, undefined);
  const [logInError, dispatchLogIn] = useFormState(logIn, undefined);
  const [isError, setIsError] = useState(false);

  const router = useRouter();
  // zod form validation, makes sure the user has inputted a proper email
  // and that the password is at least 8 chars long
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className='flex w-full flex-col'>
      {isError && (
        <div className='flex space-x-2 rounded-md border border-red-400/20 bg-red-400/30 p-4 text-sm shadow-md'>
          <AlertTriangle className='h-6 w-6' />
          <p>Invalid username or password. Please try again.</p>
        </div>
      )}
      <form
        className='flex flex-col gap-5'
        action={type === 'login' ? dispatchLogIn : dispatchSignUp}
      >
        <div className='flex flex-col gap-3'>
          <div className='w-full space-y-1'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              type='email'
              required
              maxLength={100}
            />
          </div>

          <div className='w-full space-y-1'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              name='password'
              type='password'
              required
              maxLength={100}
            />
          </div>
        </div>
        <AuthFormButton />
      </form>
    </div>
  );
}
