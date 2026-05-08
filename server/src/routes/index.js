import express from 'express';
import v1Router from './v1/v1Router.js';

const rootRouter = express.Router()

rootRouter.use('/v1', v1Router);


export default rootRouter;