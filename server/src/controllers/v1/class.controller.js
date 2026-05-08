import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { classServices } from "../../services/v1/class/index.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

const createClass = catchAsyncError(async (req, res) => {
    const user = req.user;

    const {className, classSubject, classSession} = req.body;
    if(!user) {
        throw new ErrorHandler("Unauthorized", 401)
    }

    console.log(className, classSubject, classSession)

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

const classController = {createClass, getClass, getAllCreatedClasses}

export default classController;