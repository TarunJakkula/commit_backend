import { Request, Response } from "express";
import { validationResult } from "express-validator";
import pool from "../../db";

const updatenameController = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(422).json({ validation_errors: result.array() });
    return;
  }
  const { _id, f_name, l_name } = req.body;
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
    await pool.query(
      "UPDATE users SET f_name = $1, l_name = $2 WHERE _id = $3",
      [f_name, l_name, _id]
    );
    res.send({
      message: "Updated successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export default updatenameController;
