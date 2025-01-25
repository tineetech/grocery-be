import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { RequestHandler } from "express-serve-static-core";
import { AuthMiddleware } from "../middleware/auth.verify";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/register",
      this.authController.registerCustomer as unknown as RequestHandler
    );

    this.router.post(
      "/verification",
      this.authMiddleware.verifyToken as unknown as RequestHandler,
      this.authController.verifyAccount as unknown as RequestHandler
    );

    this.router.post(
      "/login-customer",
      this.authController.loginCustomer as unknown as RequestHandler
    );
  }

  getRouter(): Router {
    return this.router;
  }
}

