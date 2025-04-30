import { Request, Response } from "express";
import { validationResult } from "express-validator";
import pool from "../../db";
import bcrypt from "bcrypt";

const updatepasswordController = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(422).json({ validation_errors: result.array() });
    return;
  }
  const { _id, old_password, new_password } = req.body;
  try {
    const user = await pool.query(
      `SELECT _id, password FROM users WHERE _id = $1`,
      [_id]
    );
    if (user.rowCount === 0) {
      res.status(403).json({
        message: "User doesn't exist",
      });
      return;
    }
    const passMatch = await bcrypt.compare(old_password, user.rows[0].password);
    if (!passMatch) {
      res.status(401).json({
        error: "Password Doesn't match",
      });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(new_password, salt);
    await pool.query("UPDATE users SET password = $1 WHERE _id = $2", [
      hashed_password,
      _id,
    ]);
    res.status(201).json({
      message: "Password updated successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export default updatepasswordController;
