import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import type { Provider } from 'next-auth/providers';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb-client';
import { connectMongo } from '@/lib/mongodb';
import { User } from '@/lib/models/user';
import { verifyPassword } from '@/lib/auth/password';
import { loginSchema } from '@/lib/schemas/auth';
import { env, isGoogleAuthEnabled } from '@/lib/env';
import authConfig from './auth.config';

const providers: Provider[] = [
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(raw) {
      const parsed = loginSchema.safeParse(raw);
      if (!parsed.success) return null;

      await connectMongo();
      const user = await User.findOne({
        email: parsed.data.email.toLowerCase().trim(),
      })
        .select('_id email name passwordHash image')
        .lean();

      if (!user || !user.passwordHash) return null;

      const valid = await verifyPassword(parsed.data.password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];

if (isGoogleAuthEnabled) {
  providers.push(
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise, { databaseName: env.MONGODB_DB_NAME }),
  providers,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: env.AUTH_SECRET,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (typeof token.id === 'string' && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
