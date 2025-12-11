import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import passport from "passport";
import { envVars } from "../../config/env";

const router = Router();
router.post("/login", AuthController.credentialLogin);

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || ("/booking" as string);

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONT_END_URL}/login?error=There is some issues with your account. Please contact with out support team!&isError=true`,
  }),
  AuthController.googleCallback
);

export const AuthRoutes = router;
