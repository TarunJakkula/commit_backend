import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import pool from "../../db.ts";
import process from "node:process";
import { validationResult } from "express-validator";

const loginController: RequestHandler = async (req: Request, res: Response) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		res.status(422).json({ error: result.array() });
		return;
	}
	const { email, password } = req.body;
	try {
		const user = await pool.query(
			`SELECT _id,password FROM users WHERE email = $1`,
			[email],
		);
		if (user.rowCount === 0) {
			res.status(404).json({
				error: "Invalid Credentials",
			});
			return;
		}
		const passMatch = await bcrypt.compare(
			password,
			user.rows[0].password,
		);
		if (!passMatch) {
			res.status(401).json({
				error: "Invalid Credentials",
			});
			return;
		}
		const token = jwt.sign(
			{ _id: user.rows[0]._id },
			`${process.env.JWT_SECRET}`,
			{
				expiresIn: "24h",
			},
		);
		res.send({ token, message: "User Authenticated Successfully" });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export default loginController;
