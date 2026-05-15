import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { classServices } from "../../services/v1/class/index.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

const createClass = catchAsyncError(async (req, res) => {
    const user = req.user;

    const {className, classSubject, classSession} = req.body;
    console.log("Creating class:", className, classSubject, classSession);
    if(!user) {
        throw new ErrorHandler("Unauthorized", 401)
    }

    if(!className || !classSubject || !classSession) {
        throw new ErrorHandler("Please provide all the required fields", 400);
    }
    const {classRoom, enrolllmentDetails} = await classServices.createClass(user, className, classSubject, classSession);

    const responseData = {
        classRoom,
        enrollment: enrolllmentDetails
    }
    return res.status(200).json(
        new ApiResponse(200, responseData, "Class created successfully")
    );
});

const getClass = catchAsyncError(async (req, res) => {
    const user = req.user;
    const {enrollmentId} = req.params;
    if(!user) {
        throw new ErrorHandler("Unauthorized", 401)
    }
    if(!enrollmentId) {
        throw new ErrorHandler("Please provide enrollment id", 400);
    }

    const classRoom = await classServices.getClass(user, enrollmentId);
    return res.status(200).json(
        new ApiResponse(200, classRoom, "Class get successfully")
    );
})

const getAllCreatedClasses = catchAsyncError(async (req, res) => {
    const user = req.user;
    let {category} = req.query;
    if(!user) {
        throw new ErrorHandler("Unauthorized", 401)
    }
    if(!category) {
        category = "created";
    }

    if(category !== "created" &&  category !== "joined") {
        category = "created";
    }

    const classRooms = await classServices.getAllCreatedClasses(user, category);
    
    return res.status(200).json(
        new ApiResponse(200, classRooms, "Class get successfully")
    );

})

const joinClass = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    const {joiningCode, branch} = req.body;

    if(!user) {
        throw new ErrorHandler("Unauthorized", 401)
    }
    if(!joiningCode) {
        throw new ErrorHandler("Please provide joining code id", 400);
    }

    const enrollmentDetails = await classServices.joinClass(user, joiningCode, branch);
    console.log(enrollmentDetails)
    return res.status(200).json(
        new ApiResponse(200, enrollmentDetails, "Class joined successfully")
    );

})

const getAllMembers = catchAsyncError(async (req, res, next) => {

    const {classId} = req.query;
    if(!classId){
        throw new ErrorHandler("Please provide class id", 400);
    }

    const members = await classServices.getAllMembers(classId);
    return res.status(200).json(
        new ApiResponse(200, members, "Members get successfully")
    );
})


const getPendingEnrollments = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    if(!user){
        throw new ErrorHandler("Unauthorized", 401)
    }
    const {classId} = req.query;
    if(!classId){
        throw new ErrorHandler("Please provide class id", 400);
    }
    const pendingEnrollments = await classServices.getPendingEnrollments(user, classId);
    return res.status(200).json(
        new ApiResponse(200, pendingEnrollments, "Pending Enrollments get successfully")
    );


})


const acceptEnrollment = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    const {enrollmentId} = req.params;
    if(!user){
        throw new ErrorHandler("Unauthorized", 401)
    }
    if(!enrollmentId){
        throw new ErrorHandler("Please provide enrollment id", 400);
    }
    const acceptedEnrollment = await classServices.acceptEnrollment(user, enrollmentId);
    return res.status(200).json(
        new ApiResponse(200, acceptedEnrollment, "Enrollment accepted successfully")
    );
})

const leftClass = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    const {enrollmentId} = req.params;
    if(!user){
        throw new ErrorHandler("Unauthorized", 401)
    }
    if(!enrollmentId){
        throw new ErrorHandler("Please provide enrollment id", 400);
    }
    const leftClass = await classServices.leftClass(user, enrollmentId);
    return res.status(200).json(
        new ApiResponse(200, leftClass, "Left class successfully")
    );
})

const getAllStudents = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    const {branch} = req.query;
    if(!user){
        throw new ErrorHandler("Unauthorized", 401)
    }
    const students = await classServices.getAllStudents(user, branch);
    return res.status(200).json(
        new ApiResponse(200, students, "Students get successfully")
    );
})

const classController = {createClass, getClass, getAllCreatedClasses, joinClass, getAllMembers, getPendingEnrollments, acceptEnrollment, leftClass, getAllStudents};

export default classController;