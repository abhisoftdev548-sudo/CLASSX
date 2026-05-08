import cluster from "node:cluster";
import ErrorHandler from "../../../utils/ErrorHandler.js";
import crypto from "crypto";
import { en } from "zod/v4/locales";


class ClassService {
    constructor(classRepository, classEnrollmentRepository, authTokenServices, userRepository, generateUniqueCode) {
        this.classRepo = classRepository;
        this.enrollRepo = classEnrollmentRepository;
        this.authTokenServices = authTokenServices;
        this.userRepo= userRepository;
        this.generateUniqueCode = generateUniqueCode;
    }

    createClass = async (user, className, classSubject, classSession) => {
        if(!user) {
            throw new ErrorHandler("user not found", 404);
        }
        if(!className || !classSubject || !classSession) {
            throw new ErrorHandler("Please provide all the required fields", 400);
        }

        const isExistingClass = await this.classRepo.findClassByCode(className);
        if(isExistingClass) {
            throw new ErrorHandler("Class with the same session already exists", 400);
        }
        const userId = user._id
       const classCode = await this.generateUniqueCode("CLS");
       const teacherCode = await this.generateUniqueCode("TCH");
       const studentCode = await this.generateUniqueCode("SDU");

       const classData = {userId, className, classSubject, classSession, classCode, studentCode, teacherCode}

      const classRoom = await this.classRepo.createClass(classData)
      if(!classRoom){
        throw new ErrorHandler("class not created", 403)
      }
      const enrollmentData = {
        classId: classRoom._id,
        userId: user._id,
        role: "creator",
        joinedAt: Date.now()
      }

      const enrolllmentDetails =   await this.enrollRepo.enrollToClass(enrollmentData);
      if(!enrolllmentDetails) {
        throw new ErrorHandler("enrollment failed", 403)
      }
      return {classRoom, enrolllmentDetails};
        
    }

    getClass = async (user, enrollmentId) => {
        if(!user) {
            throw new ErrorHandler("user not found", 404);
        }
        if(!enrollmentId) {
            throw new ErrorHandler("Please provide enrollment id", 400);
        }


        const enrollmentDetails = await this.enrollRepo.findByEnrollmentId(enrollmentId);

        if(enrollmentDetails.userId.toString() !== user._id.toString()) {
            throw new ErrorHandler("Unauthorized", 401);
        }

        if(!enrollmentDetails){
            throw new ErrorHandler("enrollment not found", 404)
        }

        const classRoom = await this.classRepo.findClassById(enrollmentDetails.classId);
        if(!classRoom){
            throw new ErrorHandler("class not found", 404)
        }
        return classRoom;
    }

    getAllCreatedClasses = async (user, category) => {
            if(!user) {
                throw new ErrorHandler("user not found", 404);
            }
            if(!category) {
                throw new ErrorHandler("Please provide category query parameter", 400);
            }

            const enrollmentDetails = await this.enrollRepo.findEnrollmentByFilter({userId: user._id, query: category})

           if(!enrollmentDetails) {
            throw new ErrorHandler("No any enrollment found", 404);
           }

           const classRooms = enrollmentDetails.map(enroll => {
            return {
                enrollmentId: enroll._id,
                role: enroll.role,
                joinedAt: enroll.joinedAt,
                class: {...enroll.classId._doc}
            }
           })
            return classRooms;
    }
}

export default ClassService