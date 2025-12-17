import { model, Schema } from "mongoose";
import { IRide } from "./ride.interface";

const rideSchema = new Schema<IRide>({});

export const Ride = model("Ride", rideSchema);
