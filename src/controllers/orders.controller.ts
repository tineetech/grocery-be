import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class OrdersController {
  async getOrders(req: Request, res: Response) {
    try {
        const { store_id } = req.query;

        const orders = await prisma.order.findMany({
            where: store_id ? { store_id: parseInt(store_id as string) } : undefined,
            include: {
                OrderItem: {  // Mengambil semua item terkait dengan order
                    include: {
                        product: true, // Menyertakan informasi produk jika ada relasi
                    },
                },
                store: {
                    select: {
                        store_name: true,
                        city: true,
                    },
                },
            },
        });

        return res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ error: "Could not fetch orders" });
    }
  }
}
