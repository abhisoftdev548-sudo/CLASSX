import nodemailer from 'nodemailer';
import mongoose from "mongoose";
import configEnv from "./config.env.js";


const config = {
  connectDB: async () => {
    try {
      const mongo_uri = configEnv.database.mongo_uri;
      const connection = await mongoose.connect(mongo_uri);
      console.log("DB Connected");

      return connection;
    } catch (error) {
      console.log("error", error);
      return null;
    }
  },

  cookieOption: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',

    path: '/',
  },

  mailConfig: async () => {
     const transporter = nodemailer.createTransport({
      host: configEnv.mailEnv.smtp_host,
      port: configEnv.mailEnv.smtp_port || 587,
      auth: {
        user: configEnv.mailEnv.smtp_user,
        pass: configEnv.mailEnv.smtp_key,
      },
    });
    return transporter;
  },
};

export default config;
