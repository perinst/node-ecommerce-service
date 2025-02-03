import { Types } from 'mongoose'
import { reservationInventory } from '../../../models.mongo/repositories/inventory.repo'
import redis from '../../connections/init.redis'
import { BadRequestError, ConflictRequestError } from '../../../core/error.response'

//

//
// export const setAsync = promisify(redisClient.set).bind(redisClient)
// export const getAsync = promisify(redisClient.get).bind(redisClient)
// export const pExpire = promisify(redisClient.pExpire).bind(redisClient)
// export const setnxAsync = promisify(redisClient.setNX).bind(redisClient)
// export const deleteAsyncKey = promisify(redisClient.del).bind(redisClient)
//

//
export const acquireLock = async (
   productId: string | Types.ObjectId,
   quantity: number,
   cartId: string
) => {
   const key = `lock_${productId}`
   const retryTime: number = 10
   const expireTime: number = 5000
   for (let i = 0; i < retryTime; i++) {
      //
      const result = await redis.setnx(key, expireTime)
      //
      if (!result) {
         await new Promise((resolve) => setTimeout(resolve, 50))
      }
      //
      const isReservation = await reservationInventory({ productId, quantity, cartId })
      //
      console.log('reservation::::', isReservation)
      //
      if (isReservation.modifiedCount && isReservation.acknowledged) {
         await redis.expire(key, 100)
         return key
      } else {
         throw new ConflictRequestError('Some Thing Wrong, Try Again!')
      }
   }
   throw new BadRequestError('Set Redis Failed!')
}
//
export const releaseLock = async (keyLock: string = '') => {
   return await redis.del(keyLock)
}
