import 'server-only';

import mongoose from 'mongoose';
import { env } from '@/lib/env';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var __mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache =
  globalThis.__mongooseCache ?? { conn: null, promise: null };

if (!globalThis.__mongooseCache) {
  globalThis.__mongooseCache = cache;
}

export async function connectMongo(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5_000,
      socketTimeoutMS: 30_000,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export async function pingMongo(): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
  try {
    const start = Date.now();
    const conn = await connectMongo();
    await conn.connection.db?.admin().ping();
    return { ok: true, latencyMs: Date.now() - start };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
