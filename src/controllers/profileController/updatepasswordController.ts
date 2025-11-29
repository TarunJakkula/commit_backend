import { Request, Response } from "express";
import pool from "../../db";
import bcrypt from "bcrypt";
import * as responses from "../../helpers/responses";

const updatepasswordController = async (req: Request, res: Response) => {
  const { _id, old_password, new_password } = req.body;
  try {
    const select_user_query = `SELECT _id, password FROM users WHERE _id = $1`;
    const user = await pool.query(select_user_query, [_id]);
    if (user.rowCount === 0) {
      res.status(403).json(responses.errorResponse("User doesn't exist"));
      return;
    }
    const passMatch = await bcrypt.compare(old_password, user.rows[0].password);
    if (!passMatch) {
      res.status(401).json(responses.errorResponse("Password Doesn't match"));
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(new_password, salt);
    const update_user_password_query = `UPDATE users SET password = $1 WHERE _id = $2`;
    await pool.query(update_user_password_query, [hashed_password, _id]);
    res
      .status(201)
      .json(responses.successResponse("Password updated successfully"));
  } catch (e: any) {
    console.error(e);
    res.status(500).json(responses.errorResponse("Internal Server Error", e));
  }
};

export default updatepasswordController;
