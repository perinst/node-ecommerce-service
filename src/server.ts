import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
//import apolloServerConnect from './graphQL/connect.graphql'
import ConnectRestFull from './restAPI/connections/connect.restfull'
// import instanceMongoDB from './database/connect.mongo'

//import { checkStatusServer } from "./helpers/check.connection";
dotenv.config()
const app = express()
// init middleware
app.use(helmet())
app.use(
   cors({
      origin: process.env.URL_SERVER,
      optionsSuccessStatus: 200,
   })
)
//
app.use(morgan('dev'))
//Check Status of server(IF YOU WANT!)
//checkStatusServer();

//Connect Server
async function main() {
   try {
      //await Promise.all([instanceMongoDB, ConnectRestFull(process.env?.PORT_REST_FULL)])
      await ConnectRestFull(process.env?.PORT_REST_FULL)
   } catch (err) {
      console.error('💀 Error starting the node server', err)
   }
}
//
void main()
