import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 60000,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

if (!uri) {
  throw new Error(
    "MONGODB_URI tanımlı değil. .env.local veya Vercel env variables kontrol et.",
  );
}

// Global cache (hem dev hem production için)
const globalAny = globalThis as any;

let clientPromise: Promise<MongoClient>;

if (!globalAny._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  globalAny._mongoClientPromise = client.connect();
}
clientPromise = globalAny._mongoClientPromise;

export default function getClientPromise(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDb() {
  const client = await clientPromise;
  return client.db("girayoloji");
}
