import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller";
import { RequestHandler } from "express-serve-static-core";
import { AuthMiddleware } from "../middleware/auth.verify";

export class CustomerRouter {
  private router: Router;
  private customerController: CustomerController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.customerController = new CustomerController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/profile",
      this.authMiddleware.verifyToken as unknown as RequestHandler,
      this.customerController.getCustomerData as unknown as RequestHandler
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
