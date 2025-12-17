import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RideService } from "./ride.service";

const createRide = catchAsync(async (req: Request, res: Response) => {
  const rideBody = req.body;
  const result = await RideService.createRide();
  sendResponse(res, {
    success: true,
    message: "User Created Successfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});
const getAllRide = catchAsync(async (req: Request, res: Response) => {
  const rideBody = req.body;
  const result = await RideService.getAllRide();
  sendResponse(res, {
    success: true,
    message: "User Created Successfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});
const getSingleRide = catchAsync(async (req: Request, res: Response) => {
  const rideBody = req.body;
  const result = await RideService.getSingleRide();
  sendResponse(res, {
    success: true,
    message: "User Created Successfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});
const updateRide = catchAsync(async (req: Request, res: Response) => {
  const rideBody = req.body;
  const result = await RideService.updateRide();
  sendResponse(res, {
    success: true,
    message: "User Created Successfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const deleteRide = catchAsync(async (req: Request, res: Response) => {
  const result = await RideService.deleteRide();
  sendResponse(res, {
    success: true,
    message: "User Created Successfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});

export const RideController = {
  createRide,
  getSingleRide,
  getAllRide,
  updateRide,
  deleteRide,
};
