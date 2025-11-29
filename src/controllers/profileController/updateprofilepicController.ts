import { Request, Response } from "express";
import pool from "../../db";
import * as responses from "../../helpers/responses";

const updateprofilepicController = async (req: Request, res: Response) => {
  const { _id } = req.body;
  const profile_pic = req.file;
  try {
    const select_user_query = `SELECT _id FROM users WHERE _id = $1`;
    const user = await pool.query(select_user_query, [_id]);
    if (user.rowCount === 0) {
      res.status(403).json(responses.errorResponse("User doesn't exist"));
      return;
    }
    if (!profile_pic) {
      res
        .status(404)
        .json(responses.errorResponse("Error uploading your image"));
      return;
    }
    const update_user_profile_pic_query = `UPDATE users SET profile_pic=$1 WHERE _id = $2`;
    await pool.query(update_user_profile_pic_query, [profile_pic.path, _id]);
    res.send(responses.successResponse("Updated successfully"));
  } catch (e: any) {
    console.error(e);
    res.status(500).json(responses.errorResponse("Internal Server Error", e));
  }
};

export default updateprofilepicController;
