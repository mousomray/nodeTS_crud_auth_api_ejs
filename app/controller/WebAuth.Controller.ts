import { UserModel } from "../model/user";
import { EmailVerificationModel } from "../model/otpverify";
import sendEmailVerificationOTP from "../helper/sendEmailVerificationOTP";
import transporter from "../config/emailtransporter";
import { comparePassword } from "../middleware/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from 'express'
import mongoose from "mongoose"; // Import mongoose
import path from "path";
import fs from "fs";
import { AuthenticatedRequest } from "../interface/authInterface";

class webauthController {

    // Handle Register
    async register(req: Request, res: Response): Promise<any> {
        try {
            // Find email from database 
            const existingUser = await UserModel.findOne({ email: req.body.email });
            // Same email not accpected
            if (existingUser) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["User already exists with this email"]
                });
            }
            // Password Validation
            if (!req.body.password) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Password is required"]
                });
            }
            if (req.body.password.length < 8) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Password should be at least 8 characters long"]
                });
            }
            // Image Path Validation
            if (!req.file) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Profile image is required"]
                });
            }
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const user = new UserModel({
                ...req.body, password: hashedPassword, image: req.file.path, roles: 'user'
            });
            const savedUser = await user.save();
            // Sent OTP after successfull register
            sendEmailVerificationOTP(req, user)
            res.status(201).json({
                sucess: true,
                message: "Registration successfull and send otp in your email id",
                user: savedUser
            })
        } catch (error) {
            console.error("Error performing register:", error);
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(400).json({
                    message: "Validation error",
                    errors: Object.values(error.errors).map((err) => err.message),
                });
            } else {
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }

    // Verify OTP
    async verifyOtp(req: Request, res: Response): Promise<any> {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ status: false, message: "All fields are required" });
            }
            const existingUser = await UserModel.findOne({ email });
            if (!existingUser) {
                return res.status(404).json({ status: "failed", message: "Email doesn't exists" });
            }
            if (existingUser.is_verified) {
                return res.status(400).json({ status: false, message: "Email is already verified" });
            }
            const emailVerification = await EmailVerificationModel.findOne({ userId: existingUser._id, otp });
            if (!emailVerification) {
                if (!existingUser.is_verified) {
                    await sendEmailVerificationOTP(req, existingUser);
                    return res.status(400).json({ status: false, message: "Invalid OTP, new OTP sent to your email" });
                }
                return res.status(400).json({ status: false, message: "Invalid OTP" });
            }
            // Check if OTP is expired
            const currentTime = new Date();
            // 15 * 60 * 1000 calculates the expiration period in milliseconds(15 minutes).
            const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
            if (currentTime > expirationTime) {
                // OTP expired, send new OTP
                await sendEmailVerificationOTP(req, existingUser);
                return res.status(400).json({ status: "failed", message: "OTP expired, new OTP sent to your email" });
            }
            // OTP is valid and not expired, mark email as verified
            existingUser.is_verified = true;
            await existingUser.save();

            // Delete email verification document
            await EmailVerificationModel.deleteMany({ userId: existingUser._id });
            return res.status(200).json({ status: true, message: "Email verified successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Unable to verify email, please try again later" });
        }
    }

    // For Login form
    async loginGet(req: AuthenticatedRequest, res: Response) {
        return res.render('admin/login', { user: req.user });
    }

    // Handle Login
    async loginPost(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                return res.status(400).send("All fields are required")
            }
            const user = await UserModel.findOne({ email })
            if (!user) {
                req.flash('err', 'User Not Found');
                return res.redirect('/admin/login');
            }
            // Check if user verified
            if (!user.is_verified) {
                req.flash('err', 'User is Not Verified');
                return res.redirect('/admin/login');
            }
            const isMatch = comparePassword(password, user.password)
            if (!isMatch) {
                req.flash('err', 'Invalid Credential');
                return res.redirect('/admin/login');
            }

            // Generate a JWT token
            const token = jwt.sign({
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                roles: user.roles
            }, process.env.API_KEY as string, { expiresIn: "1d" });

            // Handling token in cookie
            if (token) {
                res.cookie('admin_auth', token);
                req.flash('sucess', 'Login Successfully')
                return res.redirect('/admin/product');
            } else {
                req.flash('err', 'Something went wrong')
                return res.redirect('/admin/login');
            }
        } catch (error) {
            console.log(error);

        }

    }

    // Fetching Dashboard Data 
    async dashboard(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: "Unauthorized access. No user information found." });
            }
            console.log("User Data:", user);
            res.status(200).json({
                message: "Welcome to the user dashboard",
                user: user
            });
        } catch (error) {
            console.error("Server Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    };

    // Handle Logout
    async logout(req: Request, res: Response): Promise<any> {
        res.clearCookie('admin_auth');
        req.flash('sucess', 'Logout Successfully')
        return res.redirect('/admin/login');
    }

}

const WebAuthController = new webauthController()
export { WebAuthController }
