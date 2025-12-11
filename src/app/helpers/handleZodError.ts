/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TErrorSource,
  TGenericErrorResponse,
} from "../interface/error.interface";

export const handleZodError = (err: any): TGenericErrorResponse => {
  const errorSource: TErrorSource[] = [];
  err.issues.forEach((issue: any) => {
    errorSource.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });

  return {
    statusCode: 400,
    message: "Zod error",
    errorSource,
  };
};
