import { body } from "express-validator";

enum FormState {
  f_name = "First Name",
  l_name = "Last Name",
  "_id" = "User ID",
  old_password = "Current Password",
  new_password = "New Password",
}

const checkId = (field: "_id") =>
  body(field)
    .notEmpty()
    .isUUID()
    .withMessage(`${FormState[field]} must be non-empty and valid`);

const checkNonEmpty = (field: "f_name" | "l_name" | "_id") =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${FormState[field]} must be non-empty`);

const checkPasswordLength = (field: string) =>
  body(field)
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

export { checkId, checkNonEmpty, checkPasswordLength, checkCode };
