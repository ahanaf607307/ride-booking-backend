import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  USER = "RIDER",
  GUIDE = "DRIVER",
}
export interface IAuthProvider {
  provider: "google" | "credentials"; // 'google or credentials
  providerId: string;
}

export enum IIsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string | null;
  address?: string;
  isDeleted?: string;
  isActive?: IIsActive;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
  createdAt?: Date;
}
