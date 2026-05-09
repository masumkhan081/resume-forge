import 'server-only';

import { MongoClient } from 'mongodb';
import { env } from '@/lib/env';

declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise: Promise<MongoClient> =
  globalThis.__mongoClientPromise ??
  (async () => {
    const client = new MongoClient(env.MONGODB_URI);
    return client.connect();
  })();

if (!globalThis.__mongoClientPromise) {
  globalThis.__mongoClientPromise = clientPromise;
}

export default clientPromise;
