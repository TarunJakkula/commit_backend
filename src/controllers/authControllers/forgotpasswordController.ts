import { Request, Response } from "express";
import pool from "../../db";
import transporter from "../../nodemailer";
import otpGenerator from "otp-generator";
import * as responses from "../../helpers/responses";
import { EMAIL_USER } from "../../helpers/config";

const EXPIRY_MINS = 5;

const forgotpasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const select_user_query = `SELECT _id FROM users WHERE email = $1`;
    const user = await pool.query(select_user_query, [email]);
    if (user.rowCount === 0) {
      res.status(403).json(responses.errorResponse("User doesn't exit"));
      return;
    }
    const code = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + EXPIRY_MINS);
    const insert_reset_codes_query = `Insert into reset_codes(user_id,code,expires_at) values($1,$2,$3)`;
    await pool.query(insert_reset_codes_query, [
      user.rows[0]._id,
      code,
      expiryTime,
    ]);
    const mailOptions = {
      from: `${EMAIL_USER}`,
      to: email,
      subject: "Forgot Password",
      html: `Code : ${code}`,
    };
    await transporter.sendMail(mailOptions);
    const data = {
      email,
    };
    res.send(responses.successResponse("Reset code sent", data));
  } catch (e: any) {
    console.error(e);
    res.status(500).json(responses.errorResponse("Internal server error", e));
  }
};

export default forgotpasswordController;
