import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { uploadProduct, deleteFromCloudinary } from "../services/cloudinary";

const prisma = new PrismaClient();

export class ProductImageController {
  uploadMiddleware = uploadProduct.array("images", 5); // Allow up to 5 images

  async addProductImages(req: Request, res: Response) {
    try {
      const { product_id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new Error("No files uploaded");
      }

      const images = await Promise.all(
        files.map((file) =>
          prisma.productImage.create({
            data: {
              product_id: parseInt(product_id),
              url: (file as any).path,
            },
          })
        )
      );

      return res.status(201).json(images);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async getProductImages(req: Request, res: Response) {
    try {
      const { product_id } = req.params;

      const images = await prisma.productImage.findMany({
        where: { product_id: parseInt(product_id) },
      });

      return res.status(200).json(images);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async deleteProductImage(req: Request, res: Response) {
    try {
      const { image_id } = req.params;

      const image = await prisma.productImage.findUnique({
        where: { image_id: parseInt(image_id) },
        
      });

      if (!image) {
        throw new Error("Image not found");
      }

      // Delete from Cloudinary
      await deleteFromCloudinary(image.url, "product_image");

      // Delete from database
      await prisma.productImage.delete({
        where: { image_id: parseInt(image_id) },
      });

      return res
        .status(200)
        .json({ message: "Product image deleted successfully" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  // Get single product image
  async getProductImageById(req: Request, res: Response) {
    try {
      const { image_id } = req.params;

      const image = await prisma.productImage.findUnique({
        where: { image_id: parseInt(image_id) },
      });

      if (!image) {
        throw new Error("Image not found");
      }

      return res.status(200).json(image);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }
}
