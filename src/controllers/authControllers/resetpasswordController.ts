import { Request, Response } from "express";
import { validationResult } from "express-validator";
import pool from "../../db.ts";
import bcrypt from "bcrypt";
import { clear } from "node:console";

const resetpasswordController = async (req: Request, res: Response) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		res.status(422).json({ error: result.array() });
		return;
	}
	const { code, password, _id } = req.body;
	try {
		const user = await pool.query(
			`SELECT _id FROM users WHERE _id = $1`,
			[_id],
		);
		if (user.rowCount === 0) {
			res.status(403).json({
				message: "User dosen't exist",
			});
			return;
		}
		const codes = await pool.query(
			"SELECT code,expires_at from reset_codes WHERE user_id = $1",
			[_id],
		);
		if (codes.rowCount === 0) {
			res.status(404).json({
				error: "Reset code doesn't exist!",
			});
			return;
		}
		const instance = codes.rows.find((obj) => obj.code == code);
		if (!instance || (new Date(instance.expires_at) < new Date())) {
			res.status(400).json({
				error: "Invalid or expired code",
			});
			return;
		}
		const salt = await bcrypt.genSalt(10);
		const hashed_password = await bcrypt.hash(password, salt);
		await pool.query(
			`UPDATE users SET password = $1 WHERE _id = $2`,
			[hashed_password, _id],
		);
		try {
			await pool.query(
				"DELETE from reset_codes WHERE user_id = $1",
				[_id],
			);
		} catch (e) {
			console.error(e);
		}
		res.send({
			message: "Password updated successfully",
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export default resetpasswordController;
