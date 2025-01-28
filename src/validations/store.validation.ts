// validations/store.validation.ts
import { z } from "zod";

export const storeSchema = z.object({
  store_name: z.string().min(1),
  address: z.string().min(1),
  subdistrict: z.string().min(1),
  city: z.string().min(1),
  city_name: z.string().min(1),
  postcode: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  user_id: z.string().optional(),
});
