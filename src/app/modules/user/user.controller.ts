import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const picture = req.file?.path;
    const payload = {
      ...req.body,
      picture,
    };
    console.log("picture file from user", payload);
    const result = await UserService.createUserService(payload);
    sendResponse(res, {
      success: true,
      message: "User Created Successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  }
);

export const UserController = { createUser };
