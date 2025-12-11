import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: UserRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
