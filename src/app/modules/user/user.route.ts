import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { createUserValidationZodSchema } from "./user.validation";

const router = Router();
router.post(
  "/register",
  multerUpload.single("file"),
  validateRequest(createUserValidationZodSchema),
  UserController.createUser
);
router.get("/me", UserController.getMe);
export const UserRoutes = router;
