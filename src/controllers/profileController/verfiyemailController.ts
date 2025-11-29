import { Request, Response } from "express";
import otpGenerator from "otp-generator";
import pool from "../../db";
import transporter from "../../nodemailer";
import { EMAIL_USER } from "../../helpers/config";
import * as responses from "../../helpers/responses";

const EXPIRY_MINS = 15;

const sendVerificationEmail = async (req: Request, res: Response) => {
  const { _id } = req.body;
  try {
    const select_user_query = `SELECT email FROM users WHERE _id = $1`;
    const user = await pool.query(select_user_query, [_id]);
    if (user.rowCount === 0) {
      res.status(403).json(responses.errorResponse("User doesn't exist"));
      return;
    }
    const code = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const mailOptions = {
      from: `${EMAIL_USER}`,
      to: user.rows[0].email,
      subject: "Verify Email",
      html: `Code : ${code}`,
    };
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + EXPIRY_MINS);
    const insert_verification_code_query = `Insert into verification_codes(user_id,code,expires_at) values($1,$2,$3)`;
    await pool.query(insert_verification_code_query, [_id, code, expiryTime]);
    await transporter.sendMail(mailOptions);
    res.send(responses.successResponse("Verification code sent"));
  } catch (e: any) {
    console.error(e);
    res.status(500).json(responses.errorResponse("Internal Server Error", e));
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  const { _id, code } = req.body;
  try {
    const select_user_query = `SELECT _id FROM users WHERE _id = $1`;
    const user = await pool.query(select_user_query, [_id]);
    if (user.rowCount === 0) {
      res.status(403).json(responses.errorResponse("User doesn't exist"));
      return;
    }
    const select_verification_code_query = `SELECT code,expires_at from verification_codes WHERE user_id = $1`;
    const codes = await pool.query(select_verification_code_query, [
      user.rows[0]._id,
    ]);
    if (codes.rowCount === 0) {
      res.status(404).json(responses.errorResponse("Invalid or expired code"));
      return;
    }
    const instance = codes.rows.find((obj) => obj.code == code);
    if (!instance || new Date(instance.expires_at) < new Date()) {
      res.status(400).json(responses.errorResponse("Invalid or expired code"));
      return;
    }
    const update_usesr_verified_query = `UPDATE users SET verified = true WHERE _id = $1`;
    await pool.query(update_usesr_verified_query, [_id]);
    try {
      const delete_verification_codes_query = `DELETE from verification_codes WHERE user_id = $1`;
      await pool.query(delete_verification_codes_query, [_id]);
    } catch (e) {
      console.error(e);
    }
    res.send(responses.successResponse("Email Verified"));
  } catch (e: any) {
    console.error(e);
    res.status(500).json(responses.errorResponse("Internal Server Error", e));
  }
};

export { sendVerificationEmail, verifyEmail };
