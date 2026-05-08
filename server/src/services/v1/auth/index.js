import sessionModel from "../../../models/session.model.js";
import userModel from "../../../models/user.model.js";
import authSessionRepo from "../../../repositories/v1/auth/auth.session.repo.js";
import authUserRepo from "../../../repositories/v1/auth/auth.user.repo.js";
import OtpServices from "../otpServices.js";
import AuthServices from "./auth.services.js";
import AuthSessionServices from "./auth.session.services.js";
import AuthTokenServices from "./auth.token.services.js";
import mailTokenServices from "../mail.token.services.js";

const userRepository = new authUserRepo(userModel);
const sessionRepository = new authSessionRepo(sessionModel);


const authSessionServices = new AuthSessionServices(sessionRepository);
const authTokenServices = new AuthTokenServices();
const authServices = new AuthServices(userRepository, authTokenServices, authSessionServices, OtpServices, mailTokenServices);

export { authServices, authSessionServices, authTokenServices };