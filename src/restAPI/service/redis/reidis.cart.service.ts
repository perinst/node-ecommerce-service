import Redis from 'ioredis'
//

//
class RedisCartService {
   //
   protected cartRedis: Redis
   //
   constructor() {
      //this.cartRedis = new Redis()
   }
   //
   public addToCart(cartId: string, productId: string | number, quantity: number): Promise<string> {
      return new Promise(async (resolve, reject) => {
         try {
            const result = await this.cartRedis.hmset(`cart:${cartId}`, [
               `product:${productId}`,
               quantity,
            ])
            if (!result) reject()
            resolve(result)
         } catch (error) {
            reject(error)
         }
      })
   }
   //
   public getCart(cartId: string | number, productId: number | string, type: string) {
      return new Promise(async (resolve, reject) => {
         try {
            let product
            //
            switch (type) {
               case 'Spec':
                  product = await this.cartRedis.hgetall(`cart:${cartId}`)
                  break
               case 'All':
                  product = await this.cartRedis.hget(`cart:${cartId}`, `product:${productId}`)
                  break
               default:
                  reject('Missing!')
                  break
            }
            //
            if (!product) reject(product)
            resolve(product)
            //
         } catch (error) {
            reject(error)
         }
      })
   }
}

export default RedisCartService
