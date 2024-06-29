'use client';

import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';

export default function AuthFormButton() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending}>
      Log In
    </Button>
  );
}
