import bcryptjs from "bcryptjs";
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelper/AppError";
import { createNewAccessTokenUsingRefreshToken } from "../../utils/userToken";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialLogin = async (payload: Partial<IUser>) => {};
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenUsingRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  console.log("user form change pass ", decodedToken);
  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new Error("User not found");
  }
  console.log(user.password);

  if (oldPassword === newPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You Entire your old password. Please Enter new password"
    );
  }

  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old Password does not match");
  }

  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  await user!.save();
};

export const AuthService = {
  credentialLogin,
  getNewAccessToken,
  changePassword,
};
