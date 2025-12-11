import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("from req user", req.body);
    const picture = req.file?.path;
    const payload = {
      ...req.body,
      picture,
    };
    const result = await UserService.createUserService(payload);
    sendResponse(res, {
      success: true,
      message: "User Created Successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  }
);

// Get My Profile
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;
    const result = await UserService.getMe(userId);

    sendResponse(res, {
      success: true,
      message: "Get My profile retrieved Successfully",
      statusCode: StatusCodes.OK,
      data: result.data,
    });
  }
);

export const UserController = { createUser, getMe };
