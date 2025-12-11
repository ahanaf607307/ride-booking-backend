/* eslint-disable @typescript-eslint/no-explicit-any */

import { TGenericErrorResponse } from "../interface/error.interface";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/) as any;
  return {
    statusCode: 401,
    message: ` ${matchedArray[1]} already exists`,
  };
};
