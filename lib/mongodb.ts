import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI tanımlı değil.')
}

const globalAny = globalThis as any

let clientPromise: Promise<MongoClient>

if (!globalAny._mongoClientPromise) {
  const client = new MongoClient(uri)
  globalAny._mongoClientPromise = client.connect()
}
clientPromise = globalAny._mongoClientPromise

export default function getClientPromise(): Promise<MongoClient> {
  return clientPromise
}

export async function getDb() {
  const client = await clientPromise
  return client.db('girayoloji')
}