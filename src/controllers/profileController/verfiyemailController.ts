import { Request, Response } from "express";
import { validationResult } from "express-validator";
import otpGenerator from "otp-generator";
import process from "node:process";
import pool from "../../db.ts";
import transporter from "../../nodemailer.ts";

const EXPIRY_MINS = 15;

const sendVerificationEmail = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(422).json({ error: result.array() });
    return;
  }
  const { _id } = req.body;
  try {
    const user = await pool.query(`SELECT email FROM users WHERE _id = $1`, [
      _id,
    ]);
    if (user.rowCount === 0) {
      res.status(403).json({
        message: "User doesn't exist",
      });
      return;
    }
    const code = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: user.rows[0].email,
      subject: "Verify Email",
      html: `Code : ${code}`,
    };
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + EXPIRY_MINS);
    await pool.query(
      "Insert into verification_codes(user_id,code,expires_at) values($1,$2,$3)",
      [_id, code, expiryTime],
    );
    await transporter.sendMail(mailOptions);
    res.send({
      message: "Verification code sent",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(422).json({ error: result.array() });
    return;
  }
  const { _id, code } = req.body;
  try {
    const user = await pool.query(`SELECT _id FROM users WHERE _id = $1`, [
      _id,
    ]);
    if (user.rowCount === 0) {
      res.status(403).json({
        message: "User doesn't exist",
      });
      return;
    }
    const codes = await pool.query(
      "SELECT code,expires_at from verification_codes WHERE user_id = $1",
      [user.rows[0]._id],
    );
    if (codes.rowCount === 0) {
      res.status(404).json({
        error: "Invalid or expired code",
      });
      return;
    }
    const instance = codes.rows.find((obj) => obj.code == code);
    if (!instance || new Date(instance.expires_at) < new Date()) {
      res.status(400).json({
        error: "Invalid or expired code",
      });
      return;
    }
    await pool.query("UPDATE users SET verified = true WHERE _id = $1", [_id]);
    try {
      await pool.query("DELETE from verification_codes WHERE user_id = $1", [
        _id,
      ]);
    } catch (e) {
      console.error(e);
    }
    res.send({
      message: "Email Verified",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export { sendVerificationEmail, verifyEmail };
