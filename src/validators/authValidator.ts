import { body } from "express-validator";

enum FormState {
  f_name = "First Name",
  l_name = "Last Name",
  email = "Email",
  password = "Password",
}

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

const checkCode = () =>
  body("code")
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Code must be exactly 6 characters");

export { checkCode, checkEmail, checkNonEmpty, checkPasswordLength };
