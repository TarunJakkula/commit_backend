import { Request, Response } from "express";
import { validationResult } from "express-validator";
import pool from "../../db";

const updateprofilepicController = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(422).json({ validation_errors: result.array() });
    return;
  }
  const { _id } = req.body;
  const profile_pic = req.file;
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
    if (!profile_pic) {
      res.status(404).json({
        message: "Profile pic not found",
      });
      return;
    }
    await pool.query("UPDATE users SET profile_pic=$1 WHERE _id = $2", [
      profile_pic.path,
      _id,
    ]);
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

export default updateprofilepicController;
