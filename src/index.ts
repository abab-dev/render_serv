import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server } from 'colyseus'
import { monitor } from '@colyseus/monitor'

// import socialRoutes from "@colyseus/social/express"

import { MyOffice} from './rooms/MyOffice'

const port = Number(process.env.PORT || 2567)
// const allowedOrigins = ["https://vercelfe-3lmwlcdsv-dev-abhs-projects.vercel.app"]


const app = express()

app.use(cors());
app.use(express.json())
// app.use(express.static('dist'))

const server = http.createServer(app)
const gameServer = new Server({
  server,
})

//  Secure CORS
// app.use(cors({
  // origin: (origin, callback) => {
  //   if (!origin || allowedOrigins.includes(origin)) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  // credentials: true
// }));


// register your room handlers
gameServer.define('myoffice', MyOffice)

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/server/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
// app.use('/colyseus', monitor())

gameServer.listen(port)
console.log(`Listening on ws://localhost:${port}`)
