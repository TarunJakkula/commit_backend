import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import pool from "../../db.ts";

const registerController = async (req: Request, res: Response) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		res.status(422).json({ error: result.array() });
		return;
	}
	const { email, password, f_name, l_name } = req.body;
	try {
		const user = await pool.query(
			`SELECT _id FROM users WHERE email = $1`,
			[email],
		);
		if (user.rowCount !== 0) {
			res.status(403).json({
				error: "User already exists",
			});
			return;
		}
		const salt = await bcrypt.genSalt(10);
		const hashed_password = await bcrypt.hash(password, salt);
		await pool.query(
			`INSERT into users(f_name,l_name,email,password) VALUES($1,$2,$3,$4)`,
			[f_name, l_name, email, hashed_password],
		);
		res.status(201).json({
			message: "User registered successfully",
		});
	} catch (_e) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export default registerController;
