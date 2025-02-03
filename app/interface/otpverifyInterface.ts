import { Types } from "mongoose";

export interface OtpInterface {
    userId: Types.ObjectId;
    otp: string;
    createdAt: Date;
}

// User Interface for OTP
export interface UserInterface {
    _id: Types.ObjectId;
    name: string;
    email: string;
}