import jwt from 'jsonwebtoken'; // For Token
import bcrypt from 'bcryptjs'; // For Password Hashing
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interface/authInterface';

// Compare password function
const comparePassword = (password: string, hashPassword: string): boolean => {
  return bcrypt.compareSync(password, hashPassword);
};

// Middleware for authentication
const Auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"] as string;

  if (!token) {
    return res.status(403).json({ message: "A token is required for authentication" });
  }

  try {
    const decoded = jwt.verify(token, process.env.API_KEY as string);
    req.user = decoded; // Now `req.user` is properly typed
    console.log('Decoded user...', req.user);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  return next();
};

export { comparePassword, Auth }; 
