import { Request, Response } from "express";
import pool from "../../db";
import bcrypt from "bcrypt";
import * as responses from "../../helpers/responses";

const resetpasswordController = async (req: Request, res: Response) => {
  const { code, password, email } = req.body;
  try {
    const select_user_query = `SELECT _id FROM users WHERE email = $1`;
    const user = await pool.query(select_user_query, [email]);
    if (user.rowCount === 0) {
      res.status(403).json(responses.errorResponse("User dosen't exist"));
      return;
    }
    const select_codes_for_user_query = `SELECT code,expires_at from reset_codes WHERE user_id = $1`;
    const codes = await pool.query(select_codes_for_user_query, [
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
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);
    const update_user_query = `UPDATE users SET password = $1 WHERE _id = $2`;
    await pool.query(update_user_query, [hashed_password, user.rows[0]._id]);
    try {
      const delete_codes_query = `DELETE from reset_codes WHERE user_id = $1`;
      await pool.query(delete_codes_query, [user.rows[0]._id]);
    } catch (e) {
      console.error(e);
    }
    res.send(responses.successResponse("Password updated successfully"));
  } catch (e: any) {
    console.error(e);
    res.status(500).json(responses.errorResponse("Internal Server Error", e));
  }
};

export default resetpasswordController;
