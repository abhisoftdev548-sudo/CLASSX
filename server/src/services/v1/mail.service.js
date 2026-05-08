import config from "../../config/config.js";

class MailServices{

    constructor(transporter){
        this.transporter = transporter
    }
    
    async  sendEmail (options){
      const mailOptions = {
        from: `ClassX App <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.message, // Plain text version
        html: options.html, // HTML version (Professional feel ke liye)
      };
    
      // 3. Email bhejo
      await this.transporter.sendMail(mailOptions);
    };

}

const transporter = await config.mailConfig();


export default new MailServices(transporter);