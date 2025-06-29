"use client";

import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message, { action: { label: "Go to Cart", onClick: () => router.push("/cart") } });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }

      return;
    });
  };

  // Check if item is in cart
  const existItem = cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button disabled={isPending} type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
      </Button>
      <span className="px-2">{existItem.quantity}</span>
      <Button disabled={isPending} type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
      </Button>
    </div>
  ) : (
    <Button disabled={isPending} className="w-full" type="button" onClick={handleAddToCart}>
      <Plus className="w-4 h-4" />
      Add to cart
    </Button>
  );
};

export default AddToCart;

// TODO: Refresh in-stock/out-of-stock from product card in product summary
