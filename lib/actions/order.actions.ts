"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatFormError, prismaObjectToJS } from "../utils";
import { auth } from "@/auth";
import { getCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { paypal } from "../paypal";

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    const cart = await getCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return { success: false, message: "Your cart is empty", redirectTo: "/cart" };
    }
    if (!user.address) {
      return { success: false, message: "Please add a shipping address", redirectTo: "/shipping-address" };
    }
    if (!user.paymentMethod) {
      return { success: false, message: "Please select a payment method", redirectTo: "/payment-method" };
    }

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    // DB transaction
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({ data: order });
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({ data: { ...item, price: item.price, orderId: insertedOrder.id } });
      }
      // Clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: { items: [], totalPrice: 0, shippingPrice: 0, taxPrice: 0, itemsPrice: 0 },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");

    return { success: true, message: "Order successfully created", redirectTo: `/order/${insertedOrderId}` };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatFormError(error) };
  }
}

export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderItems: true, user: { select: { name: true, email: true } } },
  });
  return prismaObjectToJS(data);
}

export async function createPayPalOrder(orderId: string) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    if (order) {
      // Create a paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      // Update the order with the paypal order id
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: "0",
          },
        },
      });

      // Return the paypal order id
      return {
        success: true,
        message: "PayPal order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (err) {
    return { success: false, message: formatFormError(err) };
  }
}
