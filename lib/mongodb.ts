import { MongoClient } from 'mongodb'

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
  // eslint-disable-next-line no-var
  var _mongoConnectedAt: number | undefined
}

async function connect(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI eksik')
  const client = new MongoClient(uri)
  return client.connect()
}

function getClient(): Promise<MongoClient> {
  const globalAny = global as any
  // Eski bağlantıyı 60 saniyeden fazla kullanmıyorsa yeniden kur
  const age = globalAny._mongoConnectedAt ? Date.now() - globalAny._mongoConnectedAt : Infinity

  if (!globalAny._mongoClientPromise) {
    globalAny._mongoClientPromise = connect().then(c => {
      globalAny._mongoConnectedAt = Date.now()
      return c
    }).catch(err => {
      globalAny._mongoClientPromise = undefined
      globalAny._mongoConnectedAt = undefined
      throw err
    })
  }
  return globalAny._mongoClientPromise
}

export default getClient

export async function getDb() {
  try {
    const client = await getClient()
    return client.db('girayoloji')
  } catch (err) {
    // İlk denemeyi cache'le, sorun varsa cache temizle ve tekrar dene
    const globalAny = global as any
    globalAny._mongoClientPromise = undefined
    globalAny._mongoConnectedAt = undefined
    const client = await getClient()
    return client.db('girayoloji')
  }
}
