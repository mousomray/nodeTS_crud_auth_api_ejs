import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { OtpInterface } from "../interface/otpverifyInterface";

// Defining Schema
const emailVerificationSchema = new mongoose.Schema<OtpInterface>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '15m'
    }
});

// Model
const EmailVerificationModel = mongoose.model<OtpInterface>("EmailVerification", emailVerificationSchema);

export { EmailVerificationModel }