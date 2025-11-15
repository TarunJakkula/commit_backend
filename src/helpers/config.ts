import process from "node:process";

export const EMAIL_USER: string = process.env.EMAIL_USER || "";
export const JWT_SECRET: string = process.env.JWT_SECRET || "";
export const EMAIL_PASS: string = process.env.EMAIL_PASS || "";
export const SMTP_PORT: number = Number(process.env.SMTP_PORT) || 587;
export const SMTP_HOST: string = process.env.SMTP_HOST || "";
