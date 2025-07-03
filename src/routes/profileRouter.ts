import { Router } from "express";
import { body } from "express-validator";
import updatenameController from "../controllers/profileController/updatenameController";
import {
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/profileController/verfiyemailController";
import updatepasswordController from "../controllers/profileController/updatepasswordController";
import updateprofilepicController from "../controllers/profileController/updateprofilepicController";
import multer from "multer";
import { folderName } from "../index";
import authHandler from "../middleware/authHandler";

enum FormState {
  f_name = "First Name",
  l_name = "Last Name",
  old_password = "Current Password",
  new_password = "New Password",
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, folderName);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG and PNG are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB
  },
});

// router to handle profile
const router = Router();
router.use(authHandler);

const checkNonEmpty = (field: "f_name" | "l_name") =>
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
  checkNonEmpty("f_name"),
  checkNonEmpty("l_name"),
  updatenameController
);
router.post("/verifyemail", sendVerificationEmail);
router.patch(
  "/verifyemail",
  body("code")
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid code length"),
  verifyEmail
);
router.patch(
  "/updatepassword",
  checkPasswordLength("old_password"),
  checkPasswordLength("new_password"),
  updatepasswordController
);
router.put(
  "/updateprofilepic",
  upload.single("profile_pic"),
  updateprofilepicController
);

export default router;
