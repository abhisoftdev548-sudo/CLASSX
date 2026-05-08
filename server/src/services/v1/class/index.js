import ClassRepositiory from "../../../repositories/v1/class/class.repo.js";
import classModel from "../../../models/class.model.js";
import ClassServices from "./class.services.js";
import ClassEnrollmentRepository from "../../../repositories/v1/class/class.enrollment.repo.js";
import enrollmentModel from "../../../models/enrollment.model.js";
import AuthTokenServices from "../auth/auth.token.services.js";
import userModel from '../../../models/user.model.js';
import AuthUserRepo from '../../../repositories/v1/auth/auth.user.repo.js';
import generateUniqueCode from "./generateUniqueCode.js";
const userRepository = new AuthUserRepo(userModel);
const authTokenServices = new AuthTokenServices()
const classEnrollmentRepository = new ClassEnrollmentRepository(enrollmentModel);
const classRepository = new ClassRepositiory(classModel);
const classServices = new ClassServices(classRepository, classEnrollmentRepository, authTokenServices, userRepository, generateUniqueCode);



export { classServices };