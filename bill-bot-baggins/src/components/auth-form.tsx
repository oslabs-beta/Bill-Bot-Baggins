'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema } from '../lib/validations/form';
import { useSignIn } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { AlertTriangle } from 'lucide-react';

export default function AuthForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    // clerk provided function
    if (!isLoaded) {
      return null;
    }
    // clears error warning when a user re-submits a different username or password
    setIsError(false);

    setIsSubmitting(true);

    // attempts to login a user in Clerk with provided credentials
    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      // If successful sets an active session and redirects to /admin
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/app/dashboard');
        // not sure about the else here, will revisit
      } else {
        console.log(result);
      }
      // if there was an error logging in (wrong password/email)
      // sets an error so that it will be displayed to the user
    } catch (err: any) {
      console.log(err);
      setIsSubmitting(false);
      setIsError(true);
    }
  }
  return (
    <>
      {isError && (
        <div className='flex space-x-2 rounded-md border border-red-400/20 bg-red-400/30 p-4 text-sm shadow-md'>
          <AlertTriangle className='h-6 w-6' />
          <p>Invalid username or password. Please try again.</p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    autoComplete='current-email'
                    placeholder='admin@billbotbaggins.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    autoComplete='current-password'
                    type='password'
                    placeholder='********'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className={cn(
              'w-full gap-4 transition-all active:scale-95',
              isSubmitting && 'animate-pulse'
            )}
            type='submit'
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Form>
    </>
  );
}
