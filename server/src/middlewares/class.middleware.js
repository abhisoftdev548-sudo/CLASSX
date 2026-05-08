import { catchAsyncError } from "../utils/catchAsyncError";

const checkEnrollment = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    const userId = user._id;
    
})