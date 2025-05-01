import { Router } from "express";
import { body } from "express-validator";
import loginController from "../controllers/authControllers/loginController";
import registerController from "../controllers/authControllers/registerController";
import forgotpasswordController from "../controllers/authControllers/forgotpasswordController";
import resetpasswordController from "../controllers/authControllers/resetpasswordController";

enum FormState {
  f_name = "First Name",
  l_name = "Last Name",
  email = "Email",
  password = "Password",
}

// router to handle auth
const router = Router();

const checkNonEmpty = (field: "f_name" | "l_name") =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${FormState[field]} must be non-empty`);
const checkEmail = () =>
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Please enter a valid email address");
const checkPasswordLength = () =>
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters");

router.post("/login", checkEmail(), checkPasswordLength(), loginController);
router.post(
  "/register",
  checkEmail(),
  checkPasswordLength(),
  checkNonEmpty("f_name"),
  checkNonEmpty("l_name"),
  registerController
);
router.post("/forgotpassword", checkEmail(), forgotpasswordController);
router.patch(
  "/forgotpassword",
  checkEmail(),
  checkPasswordLength(),
  body("code").trim().notEmpty().isLength({ min: 6, max: 6 }),
  resetpasswordController
);

export default router;
