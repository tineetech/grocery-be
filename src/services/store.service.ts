// services/store.service.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { RajaOngkirService } from "./rajaongkir.service";

const prisma = new PrismaClient();

export class StoreService {
  private rajaOngkirService: RajaOngkirService;

  constructor() {
    this.rajaOngkirService = new RajaOngkirService();
  }

  async checkStoreAndUser(
    store_name: string,
    user_id?: string,
    excludeStoreId?: number
  ): Promise<void> {
    const existingStore = await prisma.store.findFirst({
      where: {
        store_name,
        NOT: excludeStoreId ? { store_id: excludeStoreId } : undefined,
      },
    });

    if (existingStore) {
      throw new Error("Store name already exists");
    }

    if (user_id) {
      const parsedUserId = parseInt(user_id);
      const existingUserStore = await prisma.store.findFirst({
        where: {
          user_id: parsedUserId,
          NOT: excludeStoreId ? { store_id: excludeStoreId } : undefined,
        },
      });

      if (existingUserStore) {
        throw new Error("User already has a store");
      }
    }
  }

  async getCityData(cityName: string) {
    try {
      // First try to find in local database
      let cityData = await prisma.rajaOngkir.findFirst({
        where: {
          city_name: {
            equals: cityName,
            mode: "insensitive",
          },
        },
      });

      // If not found, fetch from RajaOngkir API
      if (!cityData) {
        // This will fetch and save to database
        cityData = await this.rajaOngkirService.searchCity(cityName);
        if (!cityData) {
          throw new Error("City not found in RajaOngkir");
        }
      }

      return {
        city_id: cityData.city_id,
        city_name: cityData.city_name,
        province: cityData.province,
        province_id: cityData.province_id,
      };
    } catch (error) {
      throw new Error(
        `Error getting city data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async createStore(data: any) {
    try {
      // Get city data (will be fetched from API if not in database)
      const cityData = await this.getCityData(data.city_name);

      // Create the store
      return await prisma.store.create({
        data: {
          store_name: data.store_name,
          address: data.address,
          subdistrict: data.subdistrict,
          city: data.city,
          city_id: cityData.city_id,
          province: cityData.province,
          province_id: cityData.province_id,
          postcode: data.postcode,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          ...(data.user_id && {
            User: {
              connect: { user_id: parseInt(data.user_id) },
            },
          }),
          RajaOngkir: {
            connect: { city_id: cityData.city_id },
          },
        },
        include: {
          User: {
            select: {
              email: true,
              username: true,
              phone: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Error creating store: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getAllStores() {
    return prisma.store.findMany({
      include: {
        User: {
          select: {
            email: true,
            username: true,
            phone: true,
          },
        },
        Product: {
          select: {
            product_id: true,
            name: true,
            price: true,
            description: true,
          },
        },
        Inventory: {
          select: {
            inv_id: true,
            qty: true,
            total_qty: true,
            product_id: true,
          },
        },
      },
    });
  }

  async getStoreById(storeId: number) {
    return prisma.store.findUnique({
      where: { store_id: storeId },
      include: {
        User: {
          select: {
            email: true,
            username: true,
            phone: true,
          },
        },
        Product: {
          select: {
            product_id: true,
            name: true,
            price: true,
            description: true,
          },
        },
        Inventory: {
          select: {
            inv_id: true,
            qty: true,
            total_qty: true,
            product_id: true,
          },
        },
      },
    });
  }

  async updateStore(storeId: number, data: any) {
    try {
      const updateData: any = {
        ...(data.store_name && { store_name: data.store_name }),
        ...(data.address && { address: data.address }),
        ...(data.subdistrict && { subdistrict: data.subdistrict }),
        ...(data.postcode && { postcode: data.postcode }),
        ...(data.latitude && { latitude: parseFloat(data.latitude) }),
        ...(data.longitude && { longitude: parseFloat(data.longitude) }),
      };

      if (data.city_name) {
        const cityData = await this.getCityData(data.city_name);
        Object.assign(updateData, {
          city: data.city || data.city_name,
          city_id: cityData.city_id,
          province: cityData.province,
          province_id: cityData.province_id,
          RajaOngkir: {
            connect: { city_id: cityData.city_id },
          },
        });
      }

      if (data.user_id) {
        Object.assign(updateData, {
          User: {
            connect: { user_id: parseInt(data.user_id) },
          },
        });
      }

      return await prisma.store.update({
        where: { store_id: storeId },
        data: updateData,
        include: {
          User: {
            select: {
              email: true,
              username: true,
              phone: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Error updating store: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async deleteStore(storeId: number) {
    return prisma.store.delete({
      where: { store_id: storeId },
    });
  }
}
