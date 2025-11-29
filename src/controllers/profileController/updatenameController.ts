import { Request, Response } from "express";
import pool from "../../db";
import * as responses from "../../helpers/responses";

const updatenameController = async (req: Request, res: Response) => {
  const { _id, f_name, l_name } = req.body;
  try {
    const select_user_query = `SELECT _id FROM users WHERE _id = $1`;
    const user = await pool.query(select_user_query, [_id]);
    if (user.rowCount === 0) {
      res.status(403).json(responses.errorResponse("User doesn't exist"));
      return;
    }
    const update_user_details = `UPDATE users SET f_name = $1, l_name = $2 WHERE _id = $3`;
    await pool.query(update_user_details, [f_name, l_name, _id]);
    res.send(responses.successResponse("Updated successfully"));
  } catch (e: any) {
    console.error(e);
    res.status(500).json(responses.errorResponse("Internal Server Error", e));
  }
};

export default updatenameController;
