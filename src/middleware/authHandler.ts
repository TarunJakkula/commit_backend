import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../helpers/config";

const authHandler = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      error: "User not authorized",
    });
    return;
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    req.body._id = (decoded as jwt.JwtPayload)._id;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({
      error: "Invalid or expired token",
    });
    return;
  }
};

export default authHandler;
