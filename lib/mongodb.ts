import { MongoClient } from 'mongodb'

let clientPromise: Promise<MongoClient> | null = null

function getClientPromise(): Promise<MongoClient> {
  if (clientPromise) return clientPromise

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI tanimli degil. .env.local dosyasini kontrol et.')
  }

  if (process.env.NODE_ENV === 'development') {
    const g = globalThis as any
    if (!g._mongoClientPromise) {
      const client = new MongoClient(uri, {})
      g._mongoClientPromise = client.connect()
    }
    clientPromise = g._mongoClientPromise
  } else {
    const client = new MongoClient(uri, {})
    clientPromise = client.connect()
  }
  return clientPromise!
}

export default getClientPromise

export async function getDb() {
  const client = await getClientPromise()
  return client.db('girayoloji')
}
