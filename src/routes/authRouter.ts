import { Router } from "express";
import { body } from "express-validator";
import loginController from "../controllers/authControllers/loginController.ts";
import registerController from "../controllers/authControllers/registerController.ts";
import forgotpasswordController from "../controllers/authControllers/forgotpasswordController.ts";
import resetpasswordController from "../controllers/authControllers/resetpasswordController.ts";

// router to handle auth
const router = Router();

const checkNonEmpty = (field: string) => body(field).trim().notEmpty();
const checkEmail = () => body("email").trim().notEmpty().isEmail();
const checkPasswordLength = () =>
	body("password").trim().notEmpty().isLength({ min: 6 });

router.post(
	"/login",
	checkEmail(),
	checkPasswordLength(),
	loginController,
);
router.post(
	"/register",
	checkEmail(),
	checkPasswordLength(),
	checkNonEmpty("f_name"),
	registerController,
);
router.post("/forgotpassword", checkEmail(), forgotpasswordController);
router.patch(
	"/resetpassword",
	checkEmail(),
	checkPasswordLength(),
	body("code").trim().notEmpty().isLength({ min: 6, max: 6 }),
	resetpasswordController,
);

export default router;
