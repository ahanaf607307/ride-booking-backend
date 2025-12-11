import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

const createUserService = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  if (!email) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");
  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

// Get My Profile

const getMe = async (userId: string) => {
  const isUserExist = await User.findById(userId).select("-password");

  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
  }

  return {
    data: isUserExist,
  };
};

export const UserService = { createUserService, getMe };
