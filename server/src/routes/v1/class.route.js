import express from 'express';
import classController from '../../controllers/v1/class.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { createClassSchema } from '../../validations/class.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
const classRouter = express.Router();

classRouter.post('/create-class',validate(createClassSchema), authMiddleware.verifyAccess, classController.createClass);

classRouter.get('/get-all-classes', authMiddleware.verifyAccess, classController.getAllCreatedClasses)

classRouter.get('/get-class/:enrollmentId', authMiddleware.verifyAccess, classController.getClass);


export default classRouter;