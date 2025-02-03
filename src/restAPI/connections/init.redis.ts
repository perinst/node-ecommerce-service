import Redis, { Redis as RedisClient } from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

interface RedisConfig {
   host: string
   port: number
   password?: string
}

class RedisConnection {
   private static instance: RedisConnection
   private client: RedisClient | null = null
   private readonly config: RedisConfig

   private constructor() {
      this.config = {
         host: process.env.REDIS_HOST || 'localhost',
         port: Number(process.env.REDIS_PORT) || 6379,
         password: process.env.REDIS_PASSWORD,
      }
   }

   public static getInstance(): RedisClient {
      if (!RedisConnection.instance) {
         RedisConnection.instance = new RedisConnection()
      }
      return RedisConnection.instance.getClient()
   }

   public async connect(): Promise<RedisClient> {
      if (!this.client) {
         this.client = new Redis(this.config)

         this.client.on('ready', () => {
            console.log('✅ Redis connection established')
         })

         this.client.on('error', (error) => {
            console.error('❌ Redis connection error:', error)
         })
      }
      return this.client
   }

   public getClient(): RedisClient {
      if (!this.client) {
         throw new Error('Redis client not initialized. Call connect() first.')
      }
      return this.client
   }

   public async disconnect(): Promise<void> {
      if (this.client) {
         await this.client.quit()
         this.client = null
      }
   }
}

export const redisConnection = RedisConnection.getInstance()
export default redisConnection
