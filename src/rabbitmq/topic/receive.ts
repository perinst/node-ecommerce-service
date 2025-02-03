import amqplib from 'amqplib'
require('dotenv').config()
//
//const ampq_url_docker: string = process.env?.AMQP_URL_DOCKER || ''
const ampq_url_cloud: string = process.env?.AMQP_URL_CLOUD?.toString() || ''
//
export const receive = async () => {
   try {
      //1
      const connect = await amqplib.connect(ampq_url_cloud)
      //2
      const chanel = await connect.createChannel()
      //3. create name queue
      const nameExchange: string = 'send_mail'
      //
      await chanel.assertExchange(nameExchange, 'topic', {
         durable: false, // true is when restart doesn't delete data.
      })
      //4
      await chanel.assertQueue('', {
         exclusive: true,
      })
      //5. binding
      const args = process.argv.slice(2)
      if (!args.length) process.exit()
      //
      setTimeout(() => {
         connect.close()
         process.exit()
      }, 2000)
   } catch (error) {
      console.log(error)
   }
}
//
