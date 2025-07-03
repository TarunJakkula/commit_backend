import { Request, Response } from "express";
import { validationResult } from "express-validator";
import pool from "../../db";

const toggleactiveController = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(422).json({ validation_errors: result.array() });
    return;
  }

  const { branch_id, _id: user_id } = req.body;

  try {
    const branch = await pool.query(
      `SELECT _id, user_id, status
      FROM branches 
      WHERE _id = $1`,
      [branch_id]
    );
    if (branch.rowCount === 0) {
      res.status(403).json({ message: "Branch doesn't exist" });
      return;
    }
    if (branch.rows[0].user_id !== user_id) {
      res.status(403).json({
        error: "You are not authorized to access this resource",
      });
      return;
    }
    const status = branch.rows[0].status === "Active" ? "Inactive" : "Active";
    await pool.query(
      `UPDATE branches
        SET status = $1
        WHERE _id = $2`,
      [status, branch_id]
    );
    res.send({
      message: "Toggled successfully",
      data: { status },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default toggleactiveController;
