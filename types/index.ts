import { z } from "zod";
import { cartItemSchema, insertCartSchema, insertProductSchema, shippingAddressSchema } from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  // The fields define here are optional to the insertProductSchema
  // TODO: define these fields as optional in zod schema so we just import like export type Product = z.infer<typeof insertProductSchema>
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
