import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { AuthInterface } from "../interface/authInterface";

const UserSchema = new Schema<AuthInterface>({
    name: {
        type: String,
        required: [true, "Name is Required"],
        minlength: [3, 'Name must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format']
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    is_verified: { type: Boolean, default: false },
    roles: { type: String, enum: ["user", "admin"], default: "user" }
})

const UserModel = mongoose.model<AuthInterface>('user', UserSchema);

export { UserModel }