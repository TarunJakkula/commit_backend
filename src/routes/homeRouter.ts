import { Router } from "express";
import authHandler from "../middleware/authHandler";
import { body } from "express-validator";
import toggleactiveController from "../controllers/homeControllers/toggleactiveController";
import {
  createcommitController,
  createnewcommitController,
} from "../controllers/homeControllers/createcommitController";

enum FormState {
  commit = "Commit",
  mutation_level = "Mutation Level",
  branch_id = "Branch Id",
  tag_color = "Tag Color",
}

const router = Router();
router.use(authHandler);

const checkNonEmpty = (
  field: "commit" | "mutation_level" | "branch_id" | "tag_color"
) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${FormState[field]} must be non-empty`);

router.post(
  "/branch/create",
  checkNonEmpty("commit"),
  checkNonEmpty("tag_color"),
  createnewcommitController
);
router.get("/branches");
router.get("/branch/:branchID");
router.patch(
  "/branch/toggleactive",
  checkNonEmpty("branch_id"),
  toggleactiveController
);
router.delete("/branch/:branchID");

router.post(
  "/commit/create",
  checkNonEmpty("commit"),
  checkNonEmpty("tag_color"),
  checkNonEmpty("branch_id"),
  checkNonEmpty("mutation_level"),
  createcommitController
);
router.get("/commit/:commitID");
router.put("/commit/:commitID");

export default router;
