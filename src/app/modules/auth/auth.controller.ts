/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { sendResponse } from "../../utils/sendResponse";

import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userToken";
import { AuthService } from "./auth.service";

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

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "No refresh token received from cookies"
      );
    }
    const tokenInfo = await AuthService.getNewAccessToken(
      refreshToken as string
    );

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      message: "New access token retrieved Successfully",
      statusCode: StatusCodes.OK,
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      message: "User logged out Successfully",
      statusCode: StatusCodes.OK,
      data: null,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    console.log(
      "old",
      oldPassword,
      "new ",
      newPassword,
      "decodedToken ->",
      decodedToken
    );
    await AuthService.changePassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);

// forgotPassword  >
const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    await AuthService.forgotPassword(email);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Email sent Successfully",
      data: null,
    });
  }
);

// Reset Password
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userBody = req.body;

    const payload = {
      newPassword: userBody.newPassword,
      id: userBody.id,
    };

    await AuthService.resetPassword(payload, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password reset Successfully",
      data: null,
    });
  }
);

// set password >
const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;

    await AuthService.setPassword(userId, password);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password set Successfully",
      data: null,
    });
  }
);

//end of the controller
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
  getNewAccessToken,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  setPassword,
  //end of the controller
  googleCallback,
};
