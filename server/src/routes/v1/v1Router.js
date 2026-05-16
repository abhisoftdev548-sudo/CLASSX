import express from 'express';
import authRouter from './auth.routes.js';
import classRouter from './class.route.js';
import debugRouter from './debug.routes.js';

const v1Router = express.Router()

v1Router.use('/auth', authRouter)
v1Router.use('/class', classRouter)
v1Router.use('/debug', debugRouter)

export default v1Router;