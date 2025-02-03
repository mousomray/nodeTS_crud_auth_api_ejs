import { Request } from "express";
import transporter from "../config/emailtransporter";
import { EmailVerificationModel } from "../model/otpverify";
import { UserInterface } from "../interface/otpverifyInterface";

const sendEmailVerificationOTP = async (req: Request, user: UserInterface): Promise<any> => {
    try {
        // Generate a random 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000);

        // Save OTP in Database
        const newOTP = await new EmailVerificationModel({ userId: user._id, otp: otp }).save();
        console.log("OTP Saved:", newOTP);

        // OTP Verification Link
        const otpVerificationLink = process.env.FRONTEND_HOST_VERIFYEMAIL || "http://localhost:3004/verifyuser";

        // Send Email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM as string,
            to: user.email,
            subject: "OTP - Verify your account",
            html: `
        <p>Dear ${user.name},</p>
        <p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP):</p>
        <h2>OTP: ${otp}</h2>
        <p><a href="${otpVerificationLink}">Click here to verify your email</a></p>
        <p>This OTP is valid for 15 minutes. If you didn't request this OTP, please ignore this email.</p>
      `,
        });

        return otp;
    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw new Error("Failed to send OTP email");
    }
};

export default sendEmailVerificationOTP;
