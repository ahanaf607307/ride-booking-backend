/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { createNewAccessTokenUsingRefreshToken } from "../../utils/userToken";
import { IUser } from "../user/user.interface";

const credentialLogin = async (payload: Partial<IUser>) => {};
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenUsingRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  credentialLogin,
  getNewAccessToken,
};
