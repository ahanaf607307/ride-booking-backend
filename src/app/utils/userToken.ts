import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelper/AppError";
import { IIsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return { accessToken, refreshToken };
};

export const createNewAccessTokenUsingRefreshToken = async (
  refreshToken: string
) => {
  const verifyRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUser = await User.findOne({ email: verifyRefreshToken.email });

  if (!isUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User dose not xist");
  }
  if (
    isUser.isActive === IIsActive.BLOCKED ||
    isUser.isActive === IIsActive.INACTIVE
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `User is -> ${isUser.isActive}`
    );
  }

  if (isUser.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted ");
  }

  const jwtPayload = {
    userId: isUser._id,
    email: isUser.email,
    role: isUser.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return accessToken;
};
