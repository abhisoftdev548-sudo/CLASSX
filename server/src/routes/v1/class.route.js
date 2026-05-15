import express from 'express';
import classController from '../../controllers/v1/class.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { createClassSchema } from '../../validations/class.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
// import { auth } from 'firebase-admin';
const classRouter = express.Router();

classRouter.post('/create-class',validate(createClassSchema), authMiddleware.verifyAccess, classController.createClass);

classRouter.get('/get-all-classes', authMiddleware.verifyAccess, classController.getAllCreatedClasses)

classRouter.get('/get-class/:enrollmentId', authMiddleware.verifyAccess, classController.getClass);

classRouter.post('/join-class', authMiddleware.verifyAccess, classController.joinClass);

classRouter.get('/get-all-members', authMiddleware.verifyAccess, classController.getAllMembers);

classRouter.get('/pending-enrollments', authMiddleware.verifyAccess, classController.getPendingEnrollments);

classRouter.post('/accept-enrollment/:enrollmentId', authMiddleware.verifyAccess, classController.acceptEnrollment)

classRouter.post('/left-class/:enrollmentId', authMiddleware.verifyAccess, classController.leftClass);

classRouter.get('/get-all-students', authMiddleware.verifyAccess, classController.getAllStudents);

// classController.post('/require-branch-toggle', authMiddleware.verifyAccess, classController.requireBranchToggle);
export default classRouter;
