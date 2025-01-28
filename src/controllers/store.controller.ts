// controllers/store.controller.ts
import { Request, Response } from "express";
import { StoreService } from "../services/store.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class StoreController {
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();
  }

  // Make sure all methods are bound to 'this'
  public createStore = async (req: Request, res: Response) => {
    try {
      const {
        store_name,
        address,
        subdistrict,
        city,
        city_name,
        postcode,
        latitude,
        longitude,
        user_id,
      } = req.body;

      // Basic validation
      if (
        !store_name ||
        !address ||
        !city ||
        !city_name ||
        !postcode ||
        !latitude ||
        !longitude
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Parse latitude and longitude to numbers
      const parsedLatitude = parseFloat(latitude);
      const parsedLongitude = parseFloat(longitude);

      if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
        return res.status(400).json({ error: "Invalid latitude or longitude" });
      }

      // Get city data
      const cityData = await this.storeService.getCityData(city_name);

      // Check store name and user
      await this.storeService.checkStoreAndUser(store_name, user_id);

      // Create store
      const store = await this.storeService.createStore({
        store_name,
        address,
        subdistrict,
        city,
        city_id: cityData.city_id,
        province: cityData.province,
        province_id: cityData.province_id,
        postcode,
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        ...(user_id && {
          User: {
            connect: { user_id: parseInt(user_id) },
          },
        }),
        RajaOngkir: {
          connect: { city_id: cityData.city_id },
        },
      });

      return res.status(201).json(store);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res
        .status(
          error instanceof Error && error.message === "City not found"
            ? 404
            : 500
        )
        .json({ error: message });
    }
  };

  public getStores = async (req: Request, res: Response) => {
    try {
      const stores = await this.storeService.getAllStores();
      return res.status(200).json(stores);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  };

  public getStoreById = async (req: Request, res: Response) => {
    try {
      const storeId = parseInt(req.params.store_id);

      if (isNaN(storeId)) {
        return res.status(400).json({ error: "Invalid store ID" });
      }

      const store = await this.storeService.getStoreById(storeId);

      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }

      return res.status(200).json(store);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  };

  public updateStore = async (req: Request, res: Response) => {
    try {
      const storeId = parseInt(req.params.store_id);

      if (isNaN(storeId)) {
        return res.status(400).json({ error: "Invalid store ID" });
      }

      const {
        store_name,
        address,
        subdistrict,
        city,
        city_name,
        postcode,
        latitude,
        longitude,
        user_id,
      } = req.body;

      // Parse latitude and longitude if provided
      const updateData: any = {
        ...(store_name && { store_name }),
        ...(address && { address }),
        ...(subdistrict && { subdistrict }),
        ...(city && { city }),
        ...(postcode && { postcode }),
        ...(latitude && { latitude: parseFloat(latitude) }),
        ...(longitude && { longitude: parseFloat(longitude) }),
      };

      // If city_name is provided, update city-related data
      if (city_name) {
        const cityData = await this.storeService.getCityData(city_name);
        Object.assign(updateData, {
          city_id: cityData.city_id,
          province: cityData.province,
          province_id: cityData.province_id,
          RajaOngkir: {
            connect: { city_id: cityData.city_id },
          },
        });
      }

      // If user_id is provided, update user connection
      if (user_id) {
        Object.assign(updateData, {
          User: {
            connect: { user_id: parseInt(user_id) },
          },
        });
      }

      // Check store name and user if updating either
      if (store_name || user_id) {
        await this.storeService.checkStoreAndUser(store_name, user_id, storeId);
      }

      const store = await this.storeService.updateStore(storeId, updateData);

      return res.status(200).json(store);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      if (error instanceof Error && error.message === "City not found") {
        return res.status(404).json({ error: message });
      }
      return res.status(500).json({ error: message });
    }
  };

  public deleteStore = async (req: Request, res: Response) => {
    try {
      const storeId = parseInt(req.params.store_id);

      if (isNaN(storeId)) {
        return res.status(400).json({ error: "Invalid store ID" });
      }

      await this.storeService.deleteStore(storeId);

      return res.status(200).json({ message: "Store deleted successfully" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      if (message.includes("Record to delete does not exist")) {
        return res.status(404).json({ error: "Store not found" });
      }
      return res.status(500).json({ error: message });
    }
  };
}
