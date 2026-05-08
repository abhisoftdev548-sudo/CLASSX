import { authServices, authTokenServices } from "../services/v1/auth/index.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";



const verifyAccess = catchAsyncError(async(req, res, next) => {
    // const authHeader = req.headers["authorization"];

    // if(!authHeader){
    //     throw new ErrorHandler("You are not logged in", 400);
    // }

    // if(!authHeader.startsWith("Bearer ")){
    //     throw new ErrorHandler("You are not logged in", 400);
    // }

    // const accessToken = authHeader.split(" ")[1];

    const accessToken = req.cookies.AccessToken;

    if(!accessToken){
        throw new ErrorHandler("You are not logged in", 401);
    }

    
    const user = await  authServices.getUserForAccessMiddleware(accessToken);

    req.user = user;
    next();
    
})


const authMiddleware = {verifyAccess};
export default authMiddleware;