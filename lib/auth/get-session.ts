import 'server-only';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { SESSION_COOKIE } from './constants';

export type Session = {
  id: string;
  userId: string;
  email: string;
  fullName: string;
};

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) return null;

  return {
    id: session.id,
    userId: session.userId,
    email: session.user.email,
    fullName: session.user.fullName,
  };
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}
