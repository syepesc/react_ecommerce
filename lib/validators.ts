import { z } from "zod";

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  price: z.string().regex(/^\d+\.\d{2}$/, "Price must be a number with 2 decimal places"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
});

// Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});
