/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { sendResponse } from "../../utils/sendResponse";

import passport from "passport";
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userToken";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // it can be done .. but i am using passport login system from....

    // const { email, password } = req.body;
    // const loginInfo = await AuthService.credentialLogin({ email, password });

    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, err));
      }

      if (!user) {
        // return new AppError(401, info.message)
        return next(new AppError(401, `auth-> ${info.message}`));
      }

      const userToken = await createUserTokens(user);
      const { password: pass, ...rest } = user;
      setAuthCookie(res, userToken);

      sendResponse(res, {
        success: true,
        message: "User logged in Successfully",
        statusCode: StatusCodes.OK,
        data: {
          accessToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);

    // it can do but we use a reusable component for clean code ..
    // res.cookie("accessToken", loginInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    //  we use it here .....
  }
);

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? String(req.query.state) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    console.log("google callback ", user);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
    }

    const tokenInfo = createUserTokens(user);
    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONT_END_URL}/${redirectTo}`);
  }
);

export const AuthController = {
  credentialLogin,
  googleCallback,
};
