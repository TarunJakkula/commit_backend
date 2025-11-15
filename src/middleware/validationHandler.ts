import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";

const validationHandler = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(422).json({ validation_errors: result.array() });
    return;
  }
  next();
};

export default validationHandler;
