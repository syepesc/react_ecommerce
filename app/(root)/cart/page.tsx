import { getCart } from "@/lib/actions/cart.actions";
import CartTable from "@/components/cart/cart-table";

export const metadata = {
  title: "Shopping Cart",
};

const CartPage = async () => {
  const cart = await getCart();

  return (
    <>
      <CartTable cart={cart} />
    </>
  );
};

export default CartPage;
