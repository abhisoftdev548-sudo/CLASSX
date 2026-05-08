import express from 'express';
import authRouter from './auth.routes.js';
import classRouter from './class.route.js';

const v1Router = express.Router()

v1Router.use('/auth', authRouter)
v1Router.use('/class', classRouter)

export default v1Router;