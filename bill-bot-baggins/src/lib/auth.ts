import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { loginFormSchema } from './validations/form';

const config = {
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log(credentials);
        // runs on login
        // // validate credentials
        // const validatedCredentials = loginFormSchema.safeParse(credentials);
        // if (!validatedCredentials.success) {
        //   return null;
        // }
        // // extract values
        // const { email, password } = validatedCredentials.data;
        // const user = await getUserByEmail(email);
        // if (!user) {
        //   console.log('No user found');
        //   return null;
        // }
        // const passwordsMatch = await bcrypt.compare(
        //   password,
        //   user.hashedPassword
        // );
        // if (!passwordsMatch) {
        //   console.log('Invalid credentials');
        //   return null;
        // }
        // return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isAccessingApp = request.nextUrl.pathname.includes('/app');

      if (!isLoggedIn && isAccessingApp) {
        return false;
      }

      if (isLoggedIn && isAccessingApp && !auth?.user.hasPaid) {
        return NextResponse.redirect(new URL('/payment', request.nextUrl));
      }

      if (isLoggedIn && isAccessingApp && auth?.user.hasPaid) {
        return true;
      }

      if (
        isLoggedIn &&
        (request.nextUrl.pathname.includes('/login') ||
          request.nextUrl.pathname.includes('/signup')) &&
        auth?.user.hasPaid
      ) {
        return Response.redirect(new URL('/app/dashboard', request.nextUrl));
      }

      if (isLoggedIn && !isAccessingApp && !auth?.user.hasPaid) {
        console.log(request.nextUrl.pathname);
        if (
          request.nextUrl.pathname.includes('/login') ||
          request.nextUrl.pathname.includes('/signup')
        ) {
          console.log('This is the check');

          return Response.redirect(new URL('/payment', request.nextUrl));
        }

        return true;
      }

      if (!isLoggedIn && !isAccessingApp) {
        return true;
      }

      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        // on sign in
        token.userId = user.id;
        token.email = user.email!;
        token.hasPaid = user.hasPaid;
      }

      if (trigger === 'update') {
        // on every request
        const user = await getUserByEmail(token.email);
        if (user) {
          token.hasPaid = user.hasPaid;
        }
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;
      session.user.hasPaid = token.hasPaid;

      return session;
    },
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
