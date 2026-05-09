import 'server-only';

import { auth } from '@/auth';

export type Session = {
  id: string;
  userId: string;
  email: string;
  name: string | null;
};

export async function getSession(): Promise<Session | null> {
  const next = await auth();
  if (!next?.user?.id || !next.user.email) return null;
  return {
    id: next.user.id,
    userId: next.user.id,
    email: next.user.email,
    name: next.user.name ?? null,
  };
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHORIZED');
  return session;
}
