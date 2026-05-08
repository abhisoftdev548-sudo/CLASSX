import jwt from "jsonwebtoken";
import configEnv from "../../../config/config.env.js";

class AuthTokenServices {
    constructor() {
        // Secrets ko constructor mein rakhna clean rehta hai
        this.accessSecret = configEnv.auth.jwt_access_secret;
        this.accessExpiry = configEnv.auth.jwt_access_expires_in;
        this.refreshSecret = configEnv.auth.jwt_refresh_secret;
        this.refreshExpiry = configEnv.auth.jwt_refresh_expires_in;
        this.tempSecret = configEnv.auth.jwt_temp_secret;
        this.tempExpiry = configEnv.auth.jwt_temp_expires_in;
    }

    #generateToken(payload, secret, expiry) {
        return jwt.sign(payload, secret, { expiresIn: expiry });
    }

    generateAccessToken(userId) {
        return this.#generateToken({ id: userId }, this.accessSecret, this.accessExpiry);
    }

    generateRefreshToken(userId) {
        return this.#generateToken({ id: userId }, this.refreshSecret, this.refreshExpiry);
    }
    
    generateTempToken(email){
        return this.#generateToken({ email }, this.tempSecret, this.tempExpiry);
    }




    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.accessSecret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                const err = new Error("Your session has expired, please login again.");
                err.name = 'TokenExpiredError';
                throw err;
            }
            const err = new Error("Invalid token, please login again.");
            err.name = 'JsonWebTokenError';
            throw err;
        }
    }


    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.refreshSecret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                const err = new Error("Refresh token expired, please login again.");
                err.name = 'TokenExpiredError';
                throw err;
            }
            const err = new Error("Invalid refresh token, please login again.");
            err.name = 'JsonWebTokenError';
            throw err;
        }
    }
    verifyTempToken(token){
        try {
            return jwt.verify(token, this.tempSecret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                const err = new Error("Temp token expired, please try again.");
                err.name = 'TokenExpiredError';
                throw err;
            }
            const err = new Error("Invalid temp token.");
            err.name = 'JsonWebTokenError';
            throw err;
        }
    }

}

export default  AuthTokenServices; 