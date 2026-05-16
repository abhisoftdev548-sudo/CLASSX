import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import configdb from './config/config.js'
import configEnv from './config/config.env.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { globalLimiter } from './middlewares/rateLimitng.middleware.js'
const app = express()

// CORS should be the FIRST middleware
// For development, allow all origins
app.use(cors({
  origin: configEnv.client.url, // allow only configured frontend origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// DB Connection
const connectDB = configdb.connectDB;
app.use(cookieParser())
connectDB()

app.use(express.json({}))
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(globalLimiter)

import rootRouter from './routes/index.js'
// Api Router
app.use('/api', rootRouter)


app.use(errorMiddleware)



export default app;