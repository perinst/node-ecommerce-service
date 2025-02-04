import express from 'express'
import route from '../routes/index.routes'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { ErrorHandler, RequestError } from './handle.error'
//import { ConnectRedis } from './init.redis'
require('dotenv').config()
//
const app = express()
//
app.use(bodyParser.json())
//
app.use(bodyParser.urlencoded({ extended: true }))
//
app.use(cookieParser())
//
app.use(route)
//
app.use(RequestError)
//
app.use(ErrorHandler)
//
//ConnectRedis()
//
const ConnectRestFull = async (PORT: number | string = 3888) => {
   app.listen(PORT, () => {
      try {
         console.log(`Server REST FULL running on: http://localhost:${PORT}`)
      } catch (error) {
         console.log('Error connect REST FULL', error)
      }
   })
}

export default ConnectRestFull
