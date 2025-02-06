import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller";
import { RequestHandler } from "express-serve-static-core";
import { AuthMiddleware } from "../middleware/auth.verify";
import { AddressCustomerController } from "../controllers/address-customer.controller";

export class CustomerRouter {
  private router: Router;
  private customerController: CustomerController;
  private addressCustomerController: AddressCustomerController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.customerController = new CustomerController();
    this.addressCustomerController = new AddressCustomerController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/profile",
      this.authMiddleware.verifyToken as unknown as RequestHandler,
      this.customerController.getCustomerData as unknown as RequestHandler
    );

    this.router.post(
      "/profile/update",
      this.authMiddleware.verifyToken as unknown as RequestHandler,
      this.customerController.updateCustomerData as unknown as RequestHandler
    );

    this.router.post(
      "/profile/avatar/update",
      this.authMiddleware.verifyToken as unknown as RequestHandler,
      this.customerController.updateAvatarCustomerData as unknown as RequestHandler
    );
    
    this.router.get(
      "/address",
      this.authMiddleware.verifyToken as unknown as RequestHandler,
      this.addressCustomerController.getAddressCust as unknown as RequestHandler
    );

    this.router.post(
      "/address",
      this.authMiddleware.verifyToken as unknown as RequestHandler,
      this.addressCustomerController.createAddressCust as unknown as RequestHandler
    );

    this.router.post(
      "/address/update",
      this.authMiddleware.verifyToken as unknown as RequestHandler,
      this.addressCustomerController.updateCustomerData as unknown as RequestHandler
    );

    this.router.delete(
      "/address/:address_id",
      this.authMiddleware.verifyToken as unknown as RequestHandler,
      this.addressCustomerController.deleteAddress as unknown as RequestHandler
    );

    this.router.post(
      "/address/avatar/update",
      this.authMiddleware.verifyToken as unknown as RequestHandler,
      this.addressCustomerController.updateAvatarCustomerData as unknown as RequestHandler
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
