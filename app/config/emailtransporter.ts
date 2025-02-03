import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string, 
    port: parseInt(process.env.EMAIL_PORT || "587"), 
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER as string, 
        pass: process.env.EMAIL_PASS as string, 
    },
});

export default transporter;
