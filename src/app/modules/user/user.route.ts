import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { Role } from "./user.interface";
import { createUserValidationZodSchema } from "./user.validation";

const router = Router();
router.post(
  "/register",
  multerUpload.single("file"),
  validateRequest(createUserValidationZodSchema),
  UserController.createUser
);
router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe);
export const UserRoutes = router;
