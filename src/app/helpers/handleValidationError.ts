/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TErrorSource,
  TGenericErrorResponse,
} from "../interface/error.interface";

export const handleValidationError = (err: any): TGenericErrorResponse => {
  const errorSource: TErrorSource[] = [];
  const errors = Object.values(err.errors);
  errors.forEach((errorObject: any) =>
    errorSource.push({
      path: errorObject.path,
      message: errorObject.message,
    })
  );

  return {
    statusCode: 400,
    message: "validation error",
    errorSource,
  };
};
