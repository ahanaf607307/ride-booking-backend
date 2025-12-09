import { Response } from "express";

interface TMeta {
  page?: number;
  limit?: number;
  totalPage?: number;
  total?: number;
}
interface TResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
  meta?: TMeta;
}
export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    message: data.message,
    success: data.success,
    statusCode: data.statusCode,
    meta: data.meta,
    data: data.data,
  });
};
