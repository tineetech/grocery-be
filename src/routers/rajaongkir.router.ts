// // routes/rajaongkir.routes.ts
// import { Router } from "express";
// import { RajaOngkirController } from "../controllers/rajaongkir.controller";
// import { RequestHandler } from "express-serve-static-core";
// import { AuthMiddleware } from "../middleware/auth.verify";

// export class RajaOngkirRouter {
//   private router: Router;
//   private rajaOngkirController: RajaOngkirController;
//   private authMiddleware: AuthMiddleware;

//   constructor() {
//     this.router = Router();
//     this.rajaOngkirController = new RajaOngkirController();
//     this.authMiddleware = new AuthMiddleware();
//     this.initializeRoutes();
//   }

//   private initializeRoutes() {
//     // Sync cities - Super Admin only
//     this.router.post(
//       "/sync",
//       this.authMiddleware.verifyToken as unknown as RequestHandler,
//       this.authMiddleware.checkSuperAdmin as unknown as RequestHandler,
//       this.rajaOngkirController.syncCities as unknown as RequestHandler
//     );

//     // Search cities - Accessible to authenticated users
//     this.router.get(
//       "/search",
//       this.authMiddleware.verifyToken as unknown as RequestHandler,
//       this.rajaOngkirController.searchCity as unknown as RequestHandler
//     );

//     // Get provinces - Accessible to authenticated users
//     this.router.get(
//       "/provinces",
//       this.authMiddleware.verifyToken as unknown as RequestHandler,
//       this.rajaOngkirController.getProvinces as unknown as RequestHandler
//     );

//     // Get cities by province - Accessible to authenticated users
//     this.router.get(
//       "/cities/:provinceId",
//       this.authMiddleware.verifyToken as unknown as RequestHandler,
//       this.rajaOngkirController.getCitiesByProvince as unknown as RequestHandler
//     );

//     // Calculate shipping cost - Accessible to authenticated users
//     this.router.post(
//       "/cost",
//       this.authMiddleware.verifyToken as unknown as RequestHandler,
//       this.rajaOngkirController.calculateShipping as unknown as RequestHandler
//     );
//   }

//   getRouter(): Router {
//     return this.router;
//   }
// }
