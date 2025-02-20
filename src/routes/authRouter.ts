import { Router } from "express";
import { body } from "express-validator";
import loginController from "../controllers/authControllers/loginController.ts";
import registerController from "../controllers/authControllers/registerController.ts";

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
	checkNonEmpty("l_name"),
	registerController,
);

export default router;
