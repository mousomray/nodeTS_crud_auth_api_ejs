import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../interface/authInterface";

export const uiAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token: string | undefined = req.cookies?.admin_auth;

    if (!token) {
      req.flash("err", "You can't access that page without login");
      return res.redirect("/admin/login"); // Redirect to login page if user is not authenticated
    }

    // Using Promise-based jwt.verify()
    const decoded = await new Promise<JwtPayload | string>((resolve, reject) => {
      jwt.verify(token, process.env.API_KEY as string, (err, decoded) => {
        if (err) {
          reject(new Error("Invalid or expired token. Please login again."));
        } else {
          resolve(decoded as JwtPayload | string);
        }
      });
    });
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error("Error in JWT authentication middleware:", error);
    if (error.message === "Invalid or expired token. Please login again.") {
      return res.status(403).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error." });
  }
};
