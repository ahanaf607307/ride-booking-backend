import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { RideController } from "./ride.controller";

const router = Router();
router.post(
  "/create",
  checkAuth(...Object.values(Role.ADMIN)),
  RideController.createRide
);

export const RiderRoute = router;
