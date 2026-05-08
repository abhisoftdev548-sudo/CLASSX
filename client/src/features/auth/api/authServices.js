import { apiHandler } from "../../../api/apiHandler"
import { axiosInstance } from "../../../api/axiosInstance"


export const authService = {
    // 1. Explicit return keyword zaroori hai
    login: (data) => { 
        return  apiHandler(axiosInstance.post('/auth/login', data)); 
    },
    
    

    register: (data) => { 
        return apiHandler(axiosInstance.post('/auth/ragister', data)); 
    },
    
    getUser: () => { 
        return apiHandler(axiosInstance.get('/auth/getme')); 
    },
    verifyEmail: (data) => {
        return apiHandler(axiosInstance.post('/auth/verify-email-otp', data))
    },
    
    logout: () => { 
        return apiHandler(axiosInstance.post('/auth/logout')); 
    },
    
    sendEmailVarificationOtp: () => { 
        return apiHandler(axiosInstance.post('/auth/send-email-varification-otp')); 
    },

    forgetPassword: (data) => {
        return apiHandler(axiosInstance.post('/auth/forget-password', data))
    },

    resetPassword: (resetPasswordToken, data) => {
        return apiHandler(axiosInstance.post(`/auth/reset-password/${resetPasswordToken}`, data))
    },
    
    googleSync: (idToken) => {
        return apiHandler(axiosInstance.post('/auth/google-sync', { idToken }));
    }
}