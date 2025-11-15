import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../../db";
import { JWT_SECRET } from "../../helpers/config";
import * as responses from "../../helpers/responses";

const registerController = async (req: Request, res: Response) => {
  const { email, password, f_name, l_name } = req.body;
  try {
    const select_user_query = `SELECT _id FROM users WHERE email = $1`;
    const user = await pool.query(select_user_query, [email]);
    if (user.rowCount !== 0) {
      res.status(403).json(responses.errorResponse("User already exists"));
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);
    const insert_new_user_query = `INSERT into users(f_name,l_name,email,password) VALUES($1,$2,$3,$4) RETURNING _id`;
    const new_user = await pool.query(insert_new_user_query, [
      f_name,
      l_name,
      email,
      hashed_password,
    ]);
    const token = jwt.sign({ _id: new_user.rows[0]._id }, `${JWT_SECRET}`, {
      expiresIn: "24h",
    });
    const data = {
      token,
      uid: new_user.rows[0]._id,
      email,
    };
    res
      .status(201)
      .json(responses.successResponse("User registered successfully", data));
  } catch (e: any) {
    console.error(e);
    res.status(500).json(responses.errorResponse("Internal server error", e));
  }
};

export default registerController;
