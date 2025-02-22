import { Request, Response } from "express";
import { validationResult } from "express-validator";
import pool from "../../db.ts";
import transporter from "../../nodemailer.ts";
import process from "node:process";
import otpGenerator from "otp-generator";

const EXPIRY_MINS = 5;

const forgotpasswordController = async (req: Request, res: Response) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		res.status(422).json({ error: result.array() });
		return;
	}
	const { email } = req.body;
	try {
		const user = await pool.query(
			`SELECT _id FROM users WHERE email = $1`,
			[email],
		);
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
			to: email,
			subject: "Forgot Password",
			html: `Code : ${code}`,
		};
		const expiryTime = new Date();
		expiryTime.setMinutes(expiryTime.getMinutes() + EXPIRY_MINS);
		await pool.query(
			"Insert into reset_codes(user_id,code,expires_at) values($1,$2,$3)",
			[user.rows[0]._id, code, expiryTime],
		);
		await transporter.sendMail(mailOptions);
		res.send({ _id: user.rows[0]._id, message: "Reset code sent" });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default forgotpasswordController;
