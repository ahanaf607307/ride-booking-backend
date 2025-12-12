import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { OtpRouter } from "../modules/otp/otp.route";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/otp",
    route: OtpRouter,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
