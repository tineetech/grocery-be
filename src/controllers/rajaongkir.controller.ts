// // controllers/rajaongkir.controller.ts
// import { Request, Response } from "express";
// import { RajaOngkirService } from "../services/rajaongkir.service";

// export class RajaOngkirController {
//   private rajaOngkirService: RajaOngkirService;

//   constructor() {
//     this.rajaOngkirService = new RajaOngkirService();
//   }

//   public syncCities = async (req: Request, res: Response) => {
//     try {
//       const cities = await this.rajaOngkirService.syncCities();
//       return res.status(200).json({
//         message: "Cities synced successfully",
//         count: cities.length,
//       });
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : "Failed to sync cities";
//       return res.status(500).json({ error: message });
//     }
//   };

//   public searchCity = async (req: Request, res: Response) => {
//     try {
//       const { name } = req.query;
//       if (!name || typeof name !== "string") {
//         return res.status(400).json({ error: "City name is required" });
//       }

//       const city = await this.rajaOngkirService.searchCity(name);
//       if (!city) {
//         return res.status(404).json({ error: "City not found" });
//       }

//       return res.status(200).json(city);
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : "Failed to search city";
//       return res.status(500).json({ error: message });
//     }
//   };

//   public getProvinces = async (req: Request, res: Response) => {
//     try {
//       const provinces = await this.rajaOngkirService.getProvinces();
//       return res.status(200).json(provinces);
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : "Failed to get provinces";
//       return res.status(500).json({ error: message });
//     }
//   };

//   public getCitiesByProvince = async (req: Request, res: Response) => {
//     try {
//       const { provinceId } = req.params;
//       const cities = await this.rajaOngkirService.getCitiesByProvince(
//         provinceId
//       );
//       return res.status(200).json(cities);
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : "Failed to get cities";
//       return res.status(500).json({ error: message });
//     }
//   };

//   public calculateShipping = async (req: Request, res: Response) => {
//     try {
//       const { origin, destination, weight, courier } = req.body;

//       if (!origin || !destination || !weight || !courier) {
//         return res.status(400).json({
//           error: "Origin, destination, weight, and courier are required",
//         });
//       }

//       const cost = await this.rajaOngkirService.calculateShipping({
//         origin,
//         destination,
//         weight,
//         courier,
//       });

//       return res.status(200).json(cost);
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : "Failed to calculate shipping";
//       return res.status(500).json({ error: message });
//     }
//   };
// }
