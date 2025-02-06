import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class AddressCustomerController {
  async getAddressCust(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const address = await prisma.address.findMany({
        where: {
          user_id: req.user.id,
        },
        select: {
          address_id: true,
          user_id: true,
          address_name: true,
          address: true,
          subdistrict: true,
          city: true,
          province: true,
          city_id: true,
          postcode: true,
          latitude: true,
          longitude: true,
          is_primary: true,
        },
      });

      if (!address) {
        return res.status(404).json({ error: "Customer not found" });
      }

      return res.status(200).json({
        status: "success",
        data: address,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch address customer data" });
    }
  }

  async createAddressCust(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const {
        address_name,
        address,
        subdistrict,
        city,
        city_id,
        province,
        province_id,
        postcode,
        latitude,
        longitude,
        is_primary,
      } = req.body;
  
      // Validasi jika beberapa field tidak diisi
      if (!address_name || !address || !city || !province) {
        return res.status(400).json({ error: "Please fill in all required fields." });
      }
  
      const newAddress = await prisma.address.create({
        data: {
          user_id: req.user.id,
          address_name,
          address,
          subdistrict: subdistrict || null,
          city,
          city_id: city_id || null,
          province,
          province_id: province_id || null,
          postcode: postcode || null,
          latitude: latitude ? Number(latitude) : 0,
          longitude: longitude ? Number(longitude) : 0,
          is_primary: is_primary ?? false,
        },
      });
  
      return res.status(201).json({
        status: "success",
        data: newAddress,
        message: "Successfully created new address",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create address" });
    }
  }  

  async updateCustomerData(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const {
        firstName,
        lastName,
        email,
        phone,
      } = req.body;

      const updateCust = await prisma.user.update({
        where: { user_id: req.user.id },
        data: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone
        }
      })

      if (!updateCust) {
        return res.status(404).json({ error: "Customer not found" });
      }

      return res.status(200).json({
        status: "success",
        data: updateCust,
        message: "Success update profile data"
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch customer data" });
    }
  }

  async deleteAddress(req: Request, res: Response) {
    try {
      const { address_id } = req.params;
      console.log(req.params)
      await prisma.address.delete({
        where: {
          address_id: parseInt(address_id),
        },
      });

      return res.status(200).json({ message: "Address deleted successfully" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async updateAvatarCustomerData(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const {
        avatar,
      } = req.body;

      const updateCust = await prisma.user.update({
        where: { user_id: req.user.id },
        data: {
          avatar,
        }
      })

      if (!updateCust) {
        return res.status(404).json({ error: "Customer not found" });
      }

      return res.status(200).json({
        status: "success",
        data: updateCust,
        message: "Success update avatar profile"
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch customer data" });
    }
  }
}
