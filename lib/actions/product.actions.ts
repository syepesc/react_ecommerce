"use server";

import { prisma } from "@/db/prisma";
import { prismaObjectToJS } from "@/lib/utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return prismaObjectToJS(data);
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  const data = await prisma.product.findFirst({ where: { slug: slug } });
  return prismaObjectToJS(data);
}
