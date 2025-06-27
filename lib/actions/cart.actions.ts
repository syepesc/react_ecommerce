"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { formatFormError, prismaObjectToJS, round2 } from "../utils";
import { prisma } from "@/db/prisma";
import { auth } from "@/auth";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0));
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  // TODO: Reduce quantity from inventory (product table) when adding an item to the cart

  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({ where: { id: item.productId } });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({ data: newCart });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return { success: true, message: `${product.name} added to the cart` };
    } else {
      // Check for existing item in cart
      const existItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId);

      // If not enough stock, throw error
      if (existItem) {
        if (product.stock < existItem.quantity + 1) {
          throw new Error("Not enough stock");
        }

        // Increase quantity of existing item
        (cart.items as CartItem[]).find((x) => x.productId === item.productId)!.quantity = existItem.quantity + 1;
      } else {
        // If stock, add item to cart
        if (product.stock < 1) throw new Error("Not enough stock");
        cart.items.push(item);
      }

      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as CartItem[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${existItem ? "updated in" : "added to"} cart successfully`,
      };
    }
  } catch (error) {
    return { success: false, message: formatFormError(error) };
  }
}

export async function getCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  // Get session and user id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get cart items from db
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  return prismaObjectToJS({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  // TODO: Increase quantity from inventory (product table) when removing an item from the cart

  try {
    // Get session cart id
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    // Get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    // Get user cart
    const cart = await getCart();
    if (!cart) throw new Error("Cart not found");

    // Check if cart has item
    const exist = (cart.items as CartItem[]).find((x) => x.productId === productId);
    if (!exist) throw new Error("Item not found");

    // Check if cart has only one item
    if (exist.quantity === 1) {
      // Remove item from cart
      cart.items = (cart.items as CartItem[]).filter((x) => x.productId !== exist.productId);
    } else {
      // Decrease quantity of existing item
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.quantity = exist.quantity - 1;
    }

    // Update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as CartItem[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    // Revalidate product page
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name}  ${
        (cart.items as CartItem[]).find((x) => x.productId === productId) ? "updated in" : "removed from"
      } cart successfully`,
    };
  } catch (error) {
    return { success: false, message: formatFormError(error) };
  }
}

// TODO: Replace thrown errors with response that contain success, and message attributes.
