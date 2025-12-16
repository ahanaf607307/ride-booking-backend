import bcryptjs from "bcryptjs";
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { sendEmail } from "../../config/sendEmail";
import AppError from "../../errorHelper/AppError";
import { createNewAccessTokenUsingRefreshToken } from "../../utils/userToken";
import { IIsActive, IUser } from "../user/user.interface";
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

const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(StatusCodes.FORBIDDEN, "User Not Found");
  }

  if (isUserExist.isVerified == false) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not verified..");
  }

  if (
    isUserExist &&
    (isUserExist.isActive === IIsActive.BLOCKED ||
      isUserExist.isActive === IIsActive.INACTIVE)
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `User is -> ${isUserExist.isActive}...`
    );
  }

  if (isUserExist && isUserExist.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted...");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVars.FRONT_END_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgotPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};

export const AuthService = {
  credentialLogin,
  getNewAccessToken,
  changePassword,
  forgotPassword,
};
