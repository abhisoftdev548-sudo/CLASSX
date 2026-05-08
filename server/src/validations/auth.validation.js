import { z } from "zod";

const nameRule = z
  .string()
  .min(2, "Name must be at least 2 chars")
  .max(100)
  .trim();
const emailRule = z
  .string()
  .email("Invalid email address")
  .trim()
  .toLowerCase();
const mobileRule = z
  .string()
  .regex(/^\d{10,15}$/, "Invalid mobile number format");
const passwordRule = z
  .string()
  .min(6, "Password must be at least 6 characters");

export const ragisterSchema = z.object({
  name: nameRule,

  mobileNumber: mobileRule,

  email: emailRule,

  password: passwordRule,
});

export const loginSchema = z.object({
  email: emailRule,

  password: passwordRule,
});

export const forgetPasswordSchema = z.object({
  email: emailRule,
});

export const resetPasswordSchema = z.object({
  newPassword: passwordRule,
});

export const verifyEmailOtpSchema = z.object({
  otp: z.string().min(6).max(6),
});

