import { Router } from "express";

import loginController from "../controllers/authControllers/loginController";
import registerController from "../controllers/authControllers/registerController";
import forgotpasswordController from "../controllers/authControllers/forgotpasswordController";
import resetpasswordController from "../controllers/authControllers/resetpasswordController";
import * as validator from "../validators/authValidator";
import validationHandler from "../middleware/validationHandler";
// router to handle auth
const router = Router();

router.post(
  "/login",
  validator.checkEmail(),
  validator.checkPasswordLength(),
  validationHandler,
  loginController
);
router.post(
  "/register",
  validator.checkEmail(),
  validator.checkPasswordLength(),
  validator.checkNonEmpty("f_name"),
  validator.checkNonEmpty("l_name"),
  validationHandler,
  registerController
);
router.post(
  "/forgotpassword",
  validator.checkEmail(),
  validationHandler,
  forgotpasswordController
);
router.patch(
  "/forgotpassword",
  validator.checkEmail(),
  validator.checkPasswordLength(),
  validator.checkCode(),
  validationHandler,
  resetpasswordController
);

export default router;
