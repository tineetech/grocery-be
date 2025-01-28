// services/rajaongkir.service.ts
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RajaOngkirCity {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
}

interface ShippingCost {
  service: string;
  description: string;
  cost: {
    value: number;
    etd: string;
    note: string;
  }[];
}

interface CourierResult {
  code: string;
  name: string;
  costs: ShippingCost[];
}

interface RajaOngkirResponse {
  rajaongkir: {
    results: RajaOngkirCity[] | CourierResult[];
    status: {
      code: number;
      description: string;
    };
    query?: any;
  };
}

export class RajaOngkirService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = "https://api.rajaongkir.com/starter";
    this.apiKey = process.env.RAJAONGKIR_API_KEY || "";
    if (!this.apiKey) {
      throw new Error(
        "RAJAONGKIR_API_KEY is not defined in environment variables"
      );
    }
  }

  private async makeRequest(
    endpoint: string,
    method: "GET" | "POST" = "GET",
    data?: any
  ) {
    try {
      const config = {
        method,
        url: `${this.baseURL}/${endpoint}`,
        headers: {
          key: this.apiKey,
          "content-type": "application/x-www-form-urlencoded",
        },
        data,
      };

      const response = await axios<RajaOngkirResponse>(config);

      if (response.data.rajaongkir.status.code !== 200) {
        throw new Error(response.data.rajaongkir.status.description);
      }

      return response.data.rajaongkir;
    } catch (error) {
      console.error("Full error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        throw new Error(
          `RajaOngkir API Error: ${
            error.response?.data?.rajaongkir?.status?.description ||
            error.message
          }`
        );
      }
      throw error;
    }
  }

  async searchCity(cityName: string) {
    try {
      // First check local database
      let cityData = await prisma.rajaOngkir.findFirst({
        where: {
          city_name: {
            contains: cityName,
            mode: "insensitive",
          },
        },
      });

      if (cityData) {
        return cityData;
      }

      // If not in database, get all cities and filter
      const result = await this.makeRequest("city");
      const cities = result.results as RajaOngkirCity[];

      // Find matching city
      const matchingCity = cities.find((city) =>
        city.city_name.toLowerCase().includes(cityName.toLowerCase())
      );

      if (!matchingCity) {
        throw new Error("City not found");
      }

      // Save to database
      cityData = await prisma.rajaOngkir.create({
        data: {
          city_id: matchingCity.city_id,
          city_name: matchingCity.city_name,
          province_id: matchingCity.province_id,
          province: matchingCity.province,
          type: matchingCity.type,
          postal_code: matchingCity.postal_code,
        },
      });

      return cityData;
    } catch (error) {
      console.error("Error in searchCity:", error);
      throw error;
    }
  }

  async getProvinces() {
    try {
      const result = await this.makeRequest("province");
      return result.results as RajaOngkirCity[];
    } catch (error) {
      throw error;
    }
  }

  async getCities() {
    try {
      const result = await this.makeRequest("city");
      return result.results as RajaOngkirCity[];
    } catch (error) {
      throw error;
    }
  }

  async calculateShipping(
    origin: string,
    destination: string,
    weight: number,
    courier: string
  ) {
    try {
      const data = new URLSearchParams();
      data.append("origin", origin);
      data.append("destination", destination);
      data.append("weight", weight.toString());
      data.append("courier", courier.toLowerCase());

      const result = await this.makeRequest("cost", "POST", data);
      return (result.results as CourierResult[])[0].costs;
    } catch (error) {
      throw error;
    }
  }
}
