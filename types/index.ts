import { z } from "zod";
import { insertProductSchema } from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  // The fields define here are optional to the insertProductSchema
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};
