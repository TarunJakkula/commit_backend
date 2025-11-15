import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import pool from "../../db";
import * as responses from "../../helpers/responses";
import { JWT_SECRET } from "../../helpers/config";

const loginController: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const select_user_query = `SELECT _id,password FROM users WHERE email = $1`;
    const user = await pool.query(select_user_query, [email]);
    if (user.rowCount === 0) {
      res.status(404).json(responses.errorResponse("Invalid Credentials"));
      return;
    }
    const passMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!passMatch) {
      res.status(401).json(responses.errorResponse("Invalid Credentials"));
      return;
    }
    const token = jwt.sign({ _id: user.rows[0]._id }, `${JWT_SECRET}`, {
      expiresIn: "24h",
    });
    const data = {
      token,
      uid: user.rows[0]._id,
      email,
    };
    res.send(
      responses.successResponse("User Authenticated Successfully", data)
    );
  } catch (e: any) {
    console.error(e);
    res.status(500).json(responses.errorResponse("Internal Server Error", e));
  }
};

export default loginController;
