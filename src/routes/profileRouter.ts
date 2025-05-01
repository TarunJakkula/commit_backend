import { Router } from "express";
import { body } from "express-validator";
import updatenameController from "../controllers/profileController/updatenameController";
import {
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/profileController/verfiyemailController";
import updatepasswordController from "../controllers/profileController/updatepasswordController";

enum FormState {
  _id = "User Id",
  f_name = "First Name",
  l_name = "Last Name",
  old_password = "Current Password",
  new_password = "New Password",
}

// router to handle profile
const router = Router();

const checkNonEmpty = (field: "_id" | "f_name" | "l_name") =>
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

router.patch(
  "/updatename",
  checkNonEmpty("_id"),
  checkNonEmpty("f_name"),
  checkNonEmpty("l_name"),
  updatenameController
);
router.post("/verifyemail", checkNonEmpty("_id"), sendVerificationEmail);
router.patch(
  "/verifyemail",
  checkNonEmpty("_id"),
  body("code")
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid code length"),
  verifyEmail
);
router.patch(
  "/updatepassword",
  checkNonEmpty("_id"),
  checkPasswordLength("old_password"),
  checkPasswordLength("new_password"),
  updatepasswordController
);
// router.patch("/updateprofilepic", () => {});

export default router;
