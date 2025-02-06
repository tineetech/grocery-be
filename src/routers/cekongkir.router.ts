import { Router } from "express";
import { CekOngkirController } from "../controllers/cekOngkir.controller";
import { AuthMiddleware } from "../middleware/auth.verify";
import { RequestHandler } from "express-serve-static-core";
// rencana mau pake biteship aja https://biteship.com/id/docs/getting-started 
export class CekOngkirRouter {
  private router: Router;
  private rajaOngkirController: CekOngkirController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.rajaOngkirController = new CekOngkirController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Ambil daftar provinsi
    this.router.get(
      "/provinces",
      // this.authMiddleware.verifyToken as unknown as RequestHandler,
      this.rajaOngkirController.getProvinces as unknown as RequestHandler
    );

    // Ambil daftar kota berdasarkan ID provinsi
    this.router.get(
      "/cities/:provinceId",
      // this.authMiddleware.verifyToken as unknown as RequestHandler,
      this.rajaOngkirController.getCities as unknown as RequestHandler
    );

    // Hitung ongkir
    this.router.post(
      "/cost",
      this.authMiddleware.verifyToken as unknown as RequestHandler,
      this.rajaOngkirController.calculateShippingCost as unknown as RequestHandler
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
