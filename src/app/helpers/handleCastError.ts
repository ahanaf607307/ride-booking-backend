/* eslint-disable @typescript-eslint/no-explicit-any */

import { TGenericErrorResponse } from "../interface/error.interface";

export const handleCastError = (err: any): TGenericErrorResponse => {
  return {
    statusCode: 401,
    message: "Invalid ObjectId. Please provide a real id ",
  };
};
