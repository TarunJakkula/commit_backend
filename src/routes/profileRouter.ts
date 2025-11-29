import { Router } from "express";
import updatenameController from "../controllers/profileController/updatenameController";
import {
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/profileController/verfiyemailController";
import updatepasswordController from "../controllers/profileController/updatepasswordController";
import updateprofilepicController from "../controllers/profileController/updateprofilepicController";
import authHandler from "../middleware/authHandler";
import * as validator from "../validators/profileValidator";
import upload from "../helpers/multer";
import validationHandler from "../middleware/validationHandler";

// router to handle profile
const router = Router();
router.use(authHandler);

router.patch(
  "/updatename",
  validator.checkId("_id"),
  validator.checkNonEmpty("f_name"),
  validator.checkNonEmpty("l_name"),
  validationHandler,
  updatenameController
);
router.post(
  "/verifyemail",
  validator.checkId("_id"),
  validationHandler,
  sendVerificationEmail
);
router.patch(
  "/verifyemail",
  validator.checkId("_id"),
  validator.checkCode(),
  validationHandler,
  verifyEmail
);
router.patch(
  "/updatepassword",
  validator.checkId("_id"),
  validator.checkPasswordLength("old_password"),
  validator.checkPasswordLength("new_password"),
  updatepasswordController
);
router.put(
  "/updateprofilepic",
  validator.checkId("_id"),
  validationHandler,
  upload.single("profile_pic"),
  updateprofilepicController
);

export default router;
