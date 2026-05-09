import type { NextAuthConfig } from 'next-auth';

const PROTECTED_PREFIXES = ['/dashboard', '/builder', '/resume', '/profile'];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ request, auth }) {
      if (!isProtected(request.nextUrl.pathname)) return true;
      return !!auth?.user;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
