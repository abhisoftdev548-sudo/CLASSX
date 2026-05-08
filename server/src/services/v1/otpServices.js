import crypto from "crypto";
import otpModel from "../../models/otp.model.js";
import MailServices from "./mail.service.js";
class OtpServices {
constructor(mailServices, otpModel){
    this.mailServices = mailServices
    this.otpModel = otpModel
}

    async generateOTPTemplate (otp) {
    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ClassX</h1>
        </div>
        
        <div style="padding: 40px 30px; background-color: #ffffff; color: #333333;">
            <h2 style="margin-top: 0; color: #1f2937;">Verify Your Account</h2>
            <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">
                Hello Student/Teacher, <br><br>
                Thank you for using ClassX. Use the following One-Time Password (OTP) to complete your verification process. This OTP is valid for <b>10 minutes</b>.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background-color: #f3f4f6; padding: 15px 30px; border-radius: 8px; border: 2px dashed #4f46e5;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4f46e5;">${otp}</span>
                </div>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">
                If you did not request this, please ignore this email or contact support if you have concerns.
            </p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                &copy; 2026 ClassX App | RGPV Educational Resource Platform
            </p>
        </div>
    </div>
    `;
};
    async generateAndSendVerificationOtp(type, email, userId){
        
        const otp = await this.otpModel.generateAndSaveOtp(type, email, userId);
        if(!otp){
            throw new ErrorHandler("Failed to send otp", 400);
        }

        const htmlTemplete = await this.generateOTPTemplate(otp)
        const subject = 'Email Verification OTP for CLASSX APP'
        const message = `Your Verification OTP is ${otp}`

        const otpTemplete = {
            email: email,
            subject: subject,
            message: message,
            html: htmlTemplete
        }

        await this.mailServices.sendEmail(otpTemplete)
        return ;
    }

    async verifyEmailOtp(email, otp){

        const otpVerified = await this.otpModel.verifyOtp(email, otp)

        if(!otpVerified){
            return false
        }
        return otpVerified;
    }
}


export default new OtpServices(MailServices, otpModel)