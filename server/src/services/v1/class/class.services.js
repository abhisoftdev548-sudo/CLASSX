import cluster from "node:cluster";
import ErrorHandler from "../../../utils/ErrorHandler.js";
import crypto from "crypto";

class ClassService {
  constructor(
    classRepository,
    classEnrollmentRepository,
    authTokenServices,
    userRepository,
    generateUniqueCode,
  ) {
    this.classRepo = classRepository;
    this.enrollRepo = classEnrollmentRepository;
    this.authTokenServices = authTokenServices;
    this.userRepo = userRepository;
    this.generateUniqueCode = generateUniqueCode;
  }

  createClass = async (user, className, classSubject, classSession) => {
    if (!user) {
      throw new ErrorHandler("user not found", 404);
    }
    if (!className || !classSubject || !classSession) {
      throw new ErrorHandler("Please provide all the required fields", 400);
    }

    const isExistingClass = await this.classRepo.findClassByName(className);
    if (isExistingClass) {
      throw new ErrorHandler("Class with the same name already exists", 400);
    }
    const userId = user._id;
    const classCode = await this.generateUniqueCode("CLS");
    const teacherCode = await this.generateUniqueCode("TCH");
    const studentCode = await this.generateUniqueCode("STD");

    const classData = {
      userId,
      className,
      classSubject,
      classSession,
      classCode,
      studentCode,
      teacherCode,
    };

    const classRoom = await this.classRepo.createClass(classData);
    if (!classRoom) {
      throw new ErrorHandler("class not created", 403);
    }
    const enrollmentData = {
      classId: classRoom._id,
      userId: user._id,
      role: "creator",
      joinedAt: Date.now(),
      status: "accepted",
    };

    const enrolllmentDetails =
      await this.enrollRepo.enrollToClass(enrollmentData);
    if (!enrolllmentDetails) {
      throw new ErrorHandler("enrollment failed", 403);
    }
    return { classRoom, enrolllmentDetails };
  };

  getClass = async (user, enrollmentId) => {
    if (!user) {
      throw new ErrorHandler("user not found", 404);
    }
    if (!enrollmentId) {
      throw new ErrorHandler("Please provide enrollment id", 400);
    }

    const enrollmentDetails =
      await this.enrollRepo.findByEnrollmentId(enrollmentId);

    if (!enrollmentDetails) {
      throw new ErrorHandler("enrollment not found", 404);
    }

    if (enrollmentDetails.userId.toString() !== user._id.toString()) {
      throw new ErrorHandler("Unauthorized", 401);
    }

    const classRoom = await this.classRepo.findClassById(
      enrollmentDetails.classId,
    );
    if (!classRoom) {
      throw new ErrorHandler("class not found", 404);
    }
    return {
      ...classRoom._doc,
      role: enrollmentDetails.role,
      enrollmentId: enrollmentDetails._id,
      branch: enrollmentDetails.branch,
    };
  };

  getAllCreatedClasses = async (user, category) => {
    if (!user) {
      throw new ErrorHandler("user not found", 404);
    }
    if (!category) {
      throw new ErrorHandler("Please provide category query parameter", 400);
    }

    const enrollmentDetails = await this.enrollRepo.findEnrollmentByFilter({
      userId: user._id,
      query: category,
    });

    if (!enrollmentDetails) {
      throw new ErrorHandler("No any enrollment found", 404);
    }

    const classRooms = enrollmentDetails.map((enroll) => {
      return {
        enrollmentId: enroll._id,
        role: enroll.role,
        joinedAt: enroll.joinedAt,
        class: { ...enroll.classId._doc },
      };
    });
    return classRooms;
  };

  joinClass = async (user, joiningCode, branch) => {
    if (!user) {
      throw new ErrorHandler("user not found", 404);
    }
    if (!joiningCode) {
      throw new ErrorHandler("Please provide joining code", 400);
    }

    const parts = joiningCode.split("-");

    const roleTag = parts[0].toUpperCase();

    let assignedRole;
    if (roleTag === "STD") {
      if(!branch) {
        throw new ErrorHandler("Please provide branch", 400);
      }
      assignedRole = "student";
    } else if (roleTag === "TCH") {
      assignedRole = "teacher";
    } else {
      // Agar STU ya TEA mein se kuch nahi hai toh error return karo
      throw new ErrorHandler("Invalid joining code", 400);
    }
    const classRoom = await this.classRepo.findClassByCode({
      joiningCode,
      assignedRole
    });
    console.log("classRoom found:", classRoom);
    if (!classRoom) {
      throw new ErrorHandler("Class not found", 404);
    }


    const existEnrollment = await this.enrollRepo.findEnrollmentByUserAndClass(
      classRoom._id,
      user._id,
    );
    console.log("Existing enrollment:", existEnrollment);
    let enrollmentDetails;
    if (existEnrollment) {
      if (existEnrollment.role !== assignedRole) {
        enrollmentDetails = await this.enrollRepo.updateEnrollmentRole(
          existEnrollment,
          assignedRole,
        );
      } else {
        throw new ErrorHandler("You are already enrolled in this class", 400);
      }
    } else {
      enrollmentDetails = await this.enrollRepo.enrollToClass({
        classId: classRoom._id,
        userId: user._id,
        role: assignedRole,
        branch: assignedRole === "student" ? branch : null,
        joinedAt: Date.now(),
        status: "pending"
      });
    }
    if (!enrollmentDetails) {
      throw new ErrorHandler("enrollment failed", 403);
    } 
    console.log(enrollmentDetails)
    return enrollmentDetails;
  };

  getAllMembers = async (classId) => {
    if (!classId) {
      throw new ErrorHandler("Please provide class id", 400);
    }
    const members = await this.enrollRepo.getEnrollmentsByClassId(classId);
    if (!members) {
      throw new ErrorHandler("No members found", 404);
    }

    return members;
  };

  getPendingEnrollments = async (user, clssId) => {
    if (!user) {
      throw new ErrorHandler("user not found", 404);
    }
    if (!clssId) {
      throw new ErrorHandler("Please provide class id", 400);
    }

    const VerifyClassCreator = await this.enrollRepo.VerifyClassCreator(user._id, classId)

    if(!VerifyClassCreator){
      throw new ErrorHandler("class creator is not verifing", 401)
    }
    const enrollments = await this.enrollRepo.getPendingEnrollmentsByClassId(clssId);
    if (!enrollments) {
      throw new ErrorHandler("No pending enrollments found", 404);
    }
    return enrollments;
  }
  acceptEnrollment = async (user, enrollmentId) => {
    if(!user){
      throw new ErrorHandler("Unauthorized", 401)
    }


    if(!enrollmentId){
      throw new ErrorHandler("Please provide enrollment id", 400);
    }
    const acceptedEnrollment = await this.enrollRepo.acceptEnrollment(user, enrollmentId);
    return acceptedEnrollment
  }

  leftClass = async (user, enrollmentId) => {
    if(!user){
      throw new ErrorHandler("Unauthorized", 401)
    }
    if(!enrollmentId){
      throw new ErrorHandler("Please provide enrollment id", 400);
    }
    const userId  = user._id
    const leftClass = await this.enrollRepo.leftClass(userId,enrollmentId);
    return leftClass
  }

  getAllStudents = async (user, branchFilter = null) => {
    if(!user){
      throw new ErrorHandler("Unauthorized", 401)
    }
    
    // Get all classes created by the user
    const createdClasses = await this.enrollRepo.findEnrollmentByFilter({
      userId: user._id,
      query: "created"
    });
    
    if(!createdClasses || createdClasses.length === 0){
      return [];
    }
    
    const classIds = createdClasses.map(enrollment => enrollment.classId._id);
    
    // Get all students from these classes
    const allStudents = await this.enrollRepo.getAllStudentsByClassIds(classIds, branchFilter);
    
    return allStudents;
  }
}




export default ClassService;
