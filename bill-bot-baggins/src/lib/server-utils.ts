import 'server-only';

import { redirect } from 'next/navigation';
import { auth } from './auth';
import { User } from '@prisma/client';
import prisma from './db';

export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  return session;
}

export async function getUserByEmail(email: User['email']) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}
