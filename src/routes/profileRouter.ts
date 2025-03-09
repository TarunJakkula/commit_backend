import { Router } from "express";
import { body } from "express-validator";
import updatenameController from "../controllers/profileController/updatenameController.ts";
import {
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/profileController/verfiyemailController.ts";

// router to handle profile
const router = Router();

const checkNonEmpty = (field: string) => body(field).trim().notEmpty();
const checkPasswordLength = (field: string) =>
  body(field).trim().notEmpty().isLength({ min: 6 });

router.patch(
  "/updatename",
  checkNonEmpty("_id"),
  checkNonEmpty("f_name"),
  updatenameController,
);
router.get("/verifyemail", checkNonEmpty("_id"), sendVerificationEmail);
router.post(
  "/verifyemail",
  checkNonEmpty("_id"),
  body("code").trim().notEmpty().isLength({ min: 6, max: 6 }),
  verifyEmail,
);
router.patch(
  "/updatepassword",
  checkNonEmpty("_id"),
  checkPasswordLength("old_password"),
  checkPasswordLength("new_password"),
  () => {},
);
router.patch("/updateprofilepic", () => {});

export default router;
