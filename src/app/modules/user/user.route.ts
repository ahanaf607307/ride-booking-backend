import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { UserController } from "./user.controller";

const router = Router();
router.post(
  "/create-user",
  multerUpload.single("file"),
  UserController.createUser
);
export const UserRoutes = router;
