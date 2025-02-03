import { Request } from 'express';

export interface AuthInterface {
    name: string,
    email: string,
    password: string,
    image: string,
    is_verified: boolean,
    roles: string
}

// Where you use req.user then use it
export interface AuthenticatedRequest extends Request {
    user?: any; // You can replace `any` with a specific type if needed
}