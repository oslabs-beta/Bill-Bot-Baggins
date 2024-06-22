import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './server-utils';
import { loginFormSchema } from './validations/form';

const config = {
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on login
        // validate credentials
        const validatedCredentials = loginFormSchema.safeParse(credentials);
        if (!validatedCredentials.success) {
          return null;
        }
        // extract values
        const { email, password } = validatedCredentials.data;
        const user = await getUserByEmail(email);
        if (!user) {
          console.log('No user found');
          return null;
        }
        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        if (!passwordsMatch) {
          console.log('Invalid credentials');
          return null;
        }
        return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user);
      const requestedPath = request.nextUrl.pathname;

      if (!isLoggedIn && requestedPath.includes('/app')) {
        // Redirect unauthenticated users trying to access protected paths
        return false;
      }

      if (
        isLoggedIn &&
        (requestedPath.includes('/login') || requestedPath.includes('/signup'))
      ) {
        // Redirect logged-in users away from the login page
        return Response.redirect(new URL('/app/dashboard', request.nextUrl));
      }

      return true; // Default allow
    },
    jwt: async ({ token, user }) => {
      if (user) {
        // on sign in
        token.userId = user.id!;
        token.email = user.email!;
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut, handlers } = NextAuth(config);
