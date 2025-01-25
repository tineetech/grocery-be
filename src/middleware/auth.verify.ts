import { responseError } from "../helpers/responseError";
import { NextFunction, Request, Response } from "express";
import { decode, verify } from "jsonwebtoken";

type User = {
  id: number;
  role: string;
};

declare module "express" {
  interface Request {
    user?: User;
  }
}

export class AuthMiddleware {
  verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      let token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) throw "Verification Failed";

      const user = verify(token, process.env.SECRET_KEY!) as User;
      req.user = user;

      next();
    } catch (error) {
      responseError(res, error);
    }
  }

  checkRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) throw "Verification Failed";
        const decoded = decode(token);
        if (typeof decoded !== "string" && decoded && decoded.role === role) {
          next();
        } else {
          throw `You Are Not Authorized! Required role: ${role}`;
        }
      } catch (error) {
        responseError(res, error);
      }
    };
  }

  checkStrAdmin = this.checkRole("store_admin");
  checkSuperAdmin = this.checkRole("super_admin");
}
