import nodemailer from "nodemailer";
import "dotenv/config";
import { EMAIL_PASS, EMAIL_USER, SMTP_HOST, SMTP_PORT } from "./helpers/config";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export default transporter;
