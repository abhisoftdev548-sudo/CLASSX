import configEnv from "../../config/config.env.js";
import UserRepository from "../../repositories/v1/auth/auth.user.repo.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import mailService from "./mail.service.js";

class MailTokenServices{
    constructor(userRepository, mailServices){
        this.userModel = userRepository;
        this.mailServices = mailServices;
    }

    async getResetPasswordTemplate(userName, resetUrl){
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            .header { background-color: #4f46e5; padding: 20px; text-align: center; color: white; }
            .content { padding: 30px; line-height: 1.6; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { background-color: #4f46e5; color: white !important; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; }
            .footer { background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
            .link { color: #4f46e5; word-break: break-all; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Librarian - Password Reset</h2>
            </div>
            <div class="content">
                <p>Hello <strong>${userName}</strong>,</p>
                <p>Hume aapke account ke liye password reset ki request mili hai. Agar ye aapne nahi kiya, toh aap is email ko ignore kar sakte hain.</p>
                <p>Apna password reset karne ke liye niche diye gaye button par click karein:</p>
                
                <div class="button-container">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </div>

                <p>Ye link <strong>15 minute</strong> tak valid rahega.</p>
                <p>Agar button kaam nahi kar raha, toh niche diye gaye link ko copy karke browser mein paste karein:</p>
                <p class="link">${resetUrl}</p>
            </div>
            <div class="footer">
                <p>&copy; 2026 Librarian App. Sabhi adhikaar surakshit hain.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

    async sendToken(token, user){
      if(!token || !user){
        throw new ErrorHandler("Token or email is required", 400);
      }
      const resetUrl = `${configEnv.client.url}/reset-password/${token}`;
      const name = user.name;
      const mailTemplete = await this.getResetPasswordTemplate(name, resetUrl);
      const email = user.email;
      const subject = "Password Reset Url";
      const message = `Your password reset Url is ${resetUrl}. This token is valid for 30 minutes.`
      const mailData = {
        email: email,
        subject: subject,
        message: message,
        html: mailTemplete
      }
      await this.mailServices.sendEmail(mailData);
      return;

    }
}

export default new MailTokenServices(UserRepository, mailService);